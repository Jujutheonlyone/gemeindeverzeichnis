import 'dotenv/config';
import { getLatestDownloadLink } from './discover-latest';
import { downloadZip } from './download';
import { unzip } from './unzip';
import {parseGv100adTxt} from "./parse-gv100ad";
import {normalizeFromStaging, saveMunicipalities, saveStagingJson} from "./save-to-db";

async function main() {
    try {
        console.log('> Ermittle neuesten Download-Link ...');
        const url = await getLatestDownloadLink();

        console.log('> Lade ZIP herunter ...');
        const zipPath = await downloadZip(url, '.tmp');
        console.log('  gespeichert unter:', zipPath);

        console.log('> Entpacke ZIP ...');
        const extractedFile = unzip(zipPath, '.tmp');
        console.log('  entpackte Datei:', extractedFile);

        const records = parseGv100adTxt(extractedFile);

        console.log(`> Speichere ${records.length} Datensätze in Postgres ...`);

        await saveStagingJson(records);
        await normalizeFromStaging();         // 10/20/40/50 upserten
        await saveMunicipalities(records, 1000);  // 60 upserten (hast du bereits)

    } catch (err) {
        console.error('Fehler im Importprozess:', err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Importer Fehler:', err);
    process.exit(1);
});
