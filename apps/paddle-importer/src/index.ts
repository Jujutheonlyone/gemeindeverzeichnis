import 'dotenv/config';
import {getPadleCourts} from "./get-padle-courts";
import {savePadleCourtsToDB} from "./save-padle-courts-to-db";
import {closeDataSource} from "./datasource";

async function main() {
    try {
        const records = await getPadleCourts();
        await savePadleCourtsToDB(records);
        console.log(`> Speichere ${records.length} Datensätze in Postgres ...`);
    } catch (err) {
        console.error('Fehler im Importprozess:', err);
        process.exit(1);
    } finally {
        await closeDataSource();
    }
}

main().catch((err) => {
    console.error('Importer Fehler:', err);
    process.exit(1);
});
