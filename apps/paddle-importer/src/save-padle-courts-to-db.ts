import {PaddleCourt} from "./types";
import {AppDataSource} from "./datasource";


function normalizeKey(s: string) {
    return s.trim().toLowerCase();
}

function isValidWebsite(s: string) {
    const t = s.trim();
    if (!t || t === "-" || t === "http://" || t === "https://") return false;
    return true;
}

function dedupeByWebsite(records: PaddleCourt[]): PaddleCourt[] {
    const map = new Map<string, PaddleCourt>();
    for (const r of records) {
        const key = normalizeKey(r.website || "");
        if (!isValidWebsite(key)) continue;
        map.set(key, r);
    }
    return [...map.values()];
}

export async function savePadleCourtsToDB(records: PaddleCourt[], chunkSize = 1000) {
    const deduped = dedupeByWebsite(records);

    if (!deduped.length) return 0;

    const ds = AppDataSource;
    await ds.initialize();
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
        let written = 0;

        for (let i = 0; i < deduped.length; i += chunkSize) {
            const chunk = deduped.slice(i, i + chunkSize);

            const cols = [
                "website",
                "phone",
                "email",
                "street",
                "zip",
                "name",
                "indoor_courts_count",
                "outdoor_courts_count",
                "single_courts_count",
                "description",
            ] as const;

            const values: any[] = [];
            const rowsSql = chunk
                .map((r, rowIdx) => {
                    const base = rowIdx * cols.length;
                    values.push(
                        r.website || "",
                        r.phone || "",
                        r.email || "",
                        r.street || "",
                        r.zip || "",
                        r.name || "",
                        r.indoorCourtsCount ?? 0,
                        r.outdoorCourtsCount ?? 0,
                        r.singleCourtsCount ?? 0,
                        r.description || ""
                    );
                    const placeholders = cols.map((_, colIdx) => `$${base + colIdx + 1}`).join(",");
                    return `(${placeholders})`;
                })
                .join(",");

            const sql = `
        INSERT INTO gv.paddle_courts (${cols.join(",")})
        VALUES ${rowsSql}
        ON CONFLICT (website) DO UPDATE SET
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          street = EXCLUDED.street,
          zip = EXCLUDED.zip,
          name = EXCLUDED.name,
          indoor_courts_count = EXCLUDED.indoor_courts_count,
          outdoor_courts_count = EXCLUDED.outdoor_courts_count,
          single_courts_count = EXCLUDED.single_courts_count,
          description = EXCLUDED.description,
          updated_at = NOW()
      `;
            await qr.query("BEGIN");
            await qr.query(sql, values);
            await qr.query("COMMIT");

            written += chunk.length;
        }

        return written;
    } catch (err) {
        try { await qr.query("ROLLBACK"); } catch {}
        throw err;
    } finally {
        await qr.release();
    }
}
