import { DataSource } from 'typeorm';
import {GvRecord} from "./types";

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

function toIsoDate(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string') return v; // z.B. "2025-08-31"
    const y = v.jahr ?? v.year;
    const m = v.monat ?? v.month;
    const d = v.tag ?? v.day;
    if (!y || !m || !d) return null;
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
}

export async function saveMunicipalities(records: GvRecord[], batchSize = 1000) {
    // nur Gemeinden (Satzart 60)
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

            chunk.forEach((r) => {
                // ACHTUNG: Feldnamen stammen direkt aus deinem Parser (GvRecord)
                // name = r.bezeichnung
                values.push(
                    `($${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4}, $${params.length + 5}, $${params.length + 6},
            $${params.length + 7}, $${params.length + 8}, $${params.length + 9}, $${params.length + 10}, $${params.length + 11}, $${params.length + 12},
            $${params.length + 13}, $${params.length + 14}, $${params.length + 15}, $${params.length + 16}, $${params.length + 17}, $${params.length + 18},
            $${params.length + 19}, $${params.length + 20}, $${params.length + 21})`
                );

                params.push(
                    String(r.ars || '').padEnd(8).slice(0, 8),    // ars (PK)
                    toIsoDate((r as any).gebietsstand),                // << hier statt r.gebietsstand
                    (r as any).bezeichnung ?? null,               // name
                    (r as any).land ?? null,
                    (r as any).regbez ?? null,
                    (r as any).kreis ?? null,
                    (r as any).gemeinde ?? null,                  // gemeinde_code
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
            });

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
