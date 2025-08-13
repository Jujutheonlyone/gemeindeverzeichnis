import 'dotenv/config';
import { getLatestDownloadLink } from './discover-latest';
import { downloadZip } from './download';
import { unzip } from './unzip';
import {parseGv100adTxt} from "./parse-gv100ad";
import {saveMunicipalities} from "./save-to-db";

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

        const gvRecords = parseGv100adTxt(extractedFile);
        console.log('gvRecords.length', gvRecords.length);

        console.log(`> Speichere ${gvRecords.length} Datensätze in Postgres ...`);

        await saveMunicipalities(gvRecords, 1000);

    } catch (err) {
        console.error('Fehler im Importprozess:', err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Importer Fehler:', err);
    process.exit(1);
});
