import { DataSource } from 'typeorm';
import type { GvRecord } from './types';

/**
 * Single DataSource factory (no Entities, we use raw SQL for speed & control)
 */
export function createDS() {
    return new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'gvuser',
        password: process.env.DB_PASSWORD || 'changeme',
        database: process.env.DB_NAME || 'gvdb',
    });
}

/**
 * Robust date normalizer: accepts ISO string or {jahr/monat/tag} and returns
 * a valid YYYY-MM-DD or null. Prevents invalid dates like "0202-50-83".
 */
export function toIsoDateSafe(v: any): string | null {
    if (!v) return null;

    if (typeof v === 'string') {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return null;
        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);
        if (!inRange(y, 1900, 2100) || !inRange(mo, 1, 12) || !inRange(d, 1, 31)) return null;
        const dt = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`);
        return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === mo && dt.getUTCDate() === d ? v : null;
    }

    const y = Number(v.jahr ?? v.year);
    const mo = Number(v.monat ?? v.month);
    const d = Number(v.tag ?? v.day);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
    if (!inRange(y, 1900, 2100) || !inRange(mo, 1, 12) || !inRange(d, 1, 31)) return null;

    const ys = String(y).padStart(4, '0');
    const ms = String(mo).padStart(2, '0');
    const ds = String(d).padStart(2, '0');
    const dt = new Date(`${ys}-${ms}-${ds}T00:00:00Z`);
    return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === mo && dt.getUTCDate() === d
        ? `${ys}-${ms}-${ds}`
        : null;
}

function inRange(n: number, min: number, max: number) {
    return n >= min && n <= max;
}

/**
 * STAGING: write all Satzarten (10/20/30/40/50/60) into JSONB staging.
 */
export async function saveStagingJson(records: GvRecord[], batchSize = 1000) {
    if (!records.length) return;

    const ds = createDS();
    await ds.initialize();
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
        for (let i = 0; i < records.length; i += batchSize) {
            const chunk = records.slice(i, i + batchSize);

            const valuesSql: string[] = [];
            const params: any[] = [];

            for (const r of chunk) {
                const gs = toIsoDateSafe((r as any).gebietsstand);
                const ars = (r.ars || '').padEnd(8).slice(0, 8) || null;
                valuesSql.push(`($${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4})`);
                params.push(r.satzart, ars, gs, JSON.stringify(r));
            }

            await qr.query(
                `insert into gv.staging_json (satzart, ars, gebietsstand, data)
         values ${valuesSql.join(',')}`,
                params
            );
            console.log(`  → ${chunk.length} Datensätze in staging_json`);
        }

        await qr.commitTransaction();
    } catch (e) {
        await qr.rollbackTransaction();
        throw e;
    } finally {
        await qr.release();
        await ds.destroy();
    }
}

/**
 * NORMALIZE: upsert 10/20/40/50 from staging into normalized tables.
 * Uses a robust state seeding so foreign keys never fail if 10er-Sätze fehlen.
 */
export async function normalizeFromStaging() {
    const ds = createDS();
    await ds.initialize();
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
        // 10: Länder (ars2 = left(ars,2)) — robust: aus allen Satzarten "säen", Name aus 10 wenn vorhanden
        await qr.query(`
      insert into gv.state (ars2, name)
      select ars2, coalesce(max(name), 'L-' || ars2) as name
      from (
        select left(ars,2) as ars2, (data->>'bezeichnung')::text as name
        from gv.staging_json where ars ~ '^[0-9]{2,}' and satzart = '10'
        union all
        select left(ars,2) as ars2, null::text as name
        from gv.staging_json where ars ~ '^[0-9]{2,}' and satzart in ('20','30','40','50','60')
      ) s
      where ars2 is not null
      group by ars2
      on conflict (ars2) do update
      set name = coalesce(excluded.name, gv.state.name)
    `);

        // 20: Regierungsbezirke (ars3 = left(ars,3))
        await qr.query(`
            insert into gv.regbez (ars3, land_ars2, name)
            select distinct on (left(ars,3))
                left(ars,3) as ars3,
                left(ars,2) as land_ars2,
                data->>'bezeichnung' as name
            from gv.staging_json
            where satzart = '20'
              and ars ~ '^[0-9]{3,}$'
              and left(ars,2) in ('05','06','08','09')           -- nur Länder mit RB
              and (data->>'bezeichnung') is not null
            order by left(ars,3), gebietsstand desc nulls last
            on conflict (ars3) do update
                                      set land_ars2 = excluded.land_ars2,
                                      name      = excluded.name;
    `);

        // 40: Kreise (ars5 = left(ars,5))
        await qr.query(`
            insert into gv.kreis (ars5, regbez_ars3, land_ars2, name, sitz, textkennzeichen)
            select distinct on (left(ars,5))
                left(ars,5) as ars5,
                left(ars,3) as regbez_ars3,
                left(ars,2) as land_ars2,
                data->>'bezeichnung' as name,
                coalesce(data->>'verwaltungssitz','') as sitz,
                data->>'textkennzeichen' as textkennzeichen
            from gv.staging_json
            where satzart = '40' and ars is not null
            order by left(ars,5), gebietsstand desc nulls last
            on conflict (ars5) do update
                                      set regbez_ars3 = excluded.regbez_ars3,
                                      land_ars2   = excluded.land_ars2,
                                      name        = excluded.name,
                                      sitz        = excluded.sitz,
                                      textkennzeichen = excluded.textkennzeichen;
    `);

        // 50: Gemeindeverbände (ars4 = left(ars,4))
        await qr.query(`
            with v as (
                select distinct on (left(ars,4))
                left(ars,4) as ars4,
                left(ars,5) as kreis5,
                data->>'bezeichnung' as name,
                coalesce(data->>'verwaltungssitz','') as sitz,
                data->>'textkennzeichen' as textkennzeichen
            from gv.staging_json
            where satzart = '50' and ars is not null
            order by left(ars,4), gebietsstand desc nulls last
                )
            insert into gv.verband (ars4, kreis_ars5, name, sitz, textkennzeichen)
            select v.ars4,
                   k.ars5 as kreis_ars5,          -- nur setzen, wenn der Kreis existiert; sonst NULL
                   v.name,
                   v.sitz,
                   v.textkennzeichen
            from v
                     left join gv.kreis k on k.ars5 = v.kreis5
                on conflict (ars4) do update
                                          set kreis_ars5      = excluded.kreis_ars5,
                                          name            = excluded.name,
                                          sitz            = excluded.sitz,
                                          textkennzeichen = excluded.textkennzeichen;
    `);

        await qr.commitTransaction();
    } catch (e) {
        await qr.rollbackTransaction();
        throw e;
    } finally {
        await qr.release();
        await ds.destroy();
    }
}

/**
 * MUNICIPALITIES: batch upsert Satzart 60 -> gv.municipality
 */
export async function saveMunicipalities(records: GvRecord[], batchSize = 1000) {
    const rows = records.filter(r => r.satzart === '60');
    if (!rows.length) return;

    const ds = createDS();
    await ds.initialize();
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
        for (let i = 0; i < rows.length; i += batchSize) {
            const chunk = rows.slice(i, i + batchSize);

            const values: string[] = [];
            const params: any[] = [];

            for (const r of chunk) {
                values.push(
                    `($${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4}, $${params.length + 5}, $${params.length + 6},
            $${params.length + 7}, $${params.length + 8}, $${params.length + 9}, $${params.length + 10}, $${params.length + 11}, $${params.length + 12},
            $${params.length + 13}, $${params.length + 14}, $${params.length + 15}, $${params.length + 16}, $${params.length + 17}, $${params.length + 18},
            $${params.length + 19}, $${params.length + 20}, $${params.length + 21})`
                );

                params.push(
                    String(r.ars || '').padEnd(8).slice(0, 8),           // ars (PK)
                    toIsoDateSafe((r as any).gebietsstand),               // gebietsstand (safe)
                    (r as any).bezeichnung ?? null,                       // name
                    (r as any).land ?? null,
                    (r as any).regbez ?? null,
                    (r as any).kreis ?? null,
                    (r as any).gemeinde ?? null,                          // gemeinde_code
                    (r as any).gemeindeverband ?? null,
                    (r as any).textkennzeichen ?? null,
                    (r as any).flaeche_ha ?? null,
                    (r as any).einwohner_insgesamt ?? null,
                    (r as any).einwohner_maennlich ?? null,
                    (r as any).plz ?? null,
                    (r as any).plz_mehrdeutig ?? null,
                    (r as any).finanzamtsbezirk ?? null,
                    (r as any).gericht_olg ?? null,
                    (r as any).gericht_lg ?? null,
                    (r as any).gericht_ag ?? null,
                    (r as any).arbeitsagentur ?? null,
                    (r as any).btwk_von ?? null,
                    (r as any).btwk_bis ?? null
                );
            }

            const sql = `
        INSERT INTO gv.municipality
          (ars, gebietsstand, name, land, regbez, kreis, gemeinde_code, gemeindeverband,
           textkennzeichen, flaeche_ha, einwohner_insgesamt, einwohner_maennlich,
           plz, plz_mehrdeutig, finanzamtsbezirk, gericht_olg, gericht_lg, gericht_ag,
           arbeitsagentur, btwk_von, btwk_bis)
        VALUES ${values.join(',')}
        ON CONFLICT (ars) DO UPDATE SET
          gebietsstand = EXCLUDED.gebietsstand,
          name = EXCLUDED.name,
          land = EXCLUDED.land,
          regbez = EXCLUDED.regbez,
          kreis = EXCLUDED.kreis,
          gemeinde_code = EXCLUDED.gemeinde_code,
          gemeindeverband = EXCLUDED.gemeindeverband,
          textkennzeichen = EXCLUDED.textkennzeichen,
          flaeche_ha = EXCLUDED.flaeche_ha,
          einwohner_insgesamt = EXCLUDED.einwohner_insgesamt,
          einwohner_maennlich = EXCLUDED.einwohner_maennlich,
          plz = EXCLUDED.plz,
          plz_mehrdeutig = EXCLUDED.plz_mehrdeutig,
          finanzamtsbezirk = EXCLUDED.finanzamtsbezirk,
          gericht_olg = EXCLUDED.gericht_olg,
          gericht_lg = EXCLUDED.gericht_lg,
          gericht_ag = EXCLUDED.gericht_ag,
          arbeitsagentur = EXCLUDED.arbeitsagentur,
          btwk_von = EXCLUDED.btwk_von,
          btwk_bis = EXCLUDED.btwk_bis,
          updated_at = now()
      `;

            await qr.query(sql, params);
            console.log(`  → ${chunk.length} Gemeinden upserted`);
        }

        await qr.commitTransaction();
    } catch (e) {
        await qr.rollbackTransaction();
        throw e;
    } finally {
        await qr.release();
        await ds.destroy();
    }
}
