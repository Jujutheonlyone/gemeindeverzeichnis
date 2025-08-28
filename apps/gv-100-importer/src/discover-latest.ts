import axios from 'axios';
import * as cheerio from 'cheerio';


const BASE = 'https://www.destatis.de';
const LIST_PAGE = `${BASE}/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html#101366`;

function parseGermanDateToPath(dateStr: string): string {
    const m = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!m) throw new Error('Datum im falschen Format');
    return `${m[1]}${m[2]}`;
}

export async function getLatestDownloadLink(): Promise<string> {
    const { data: html } = await axios.get(LIST_PAGE, { maxRedirects: 5 });
    const $ = cheerio.load(html);
    const anchor = $('#101366 ul').first().find('li a').first();
    const dateText = anchor.text().trim();
    if (!dateText) throw new Error('Anchor #101366 > ul:nth-of-type(1) > li > a nicht gefunden');

    const path = parseGermanDateToPath(dateText);
    const downloadUrl = `${BASE}/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Administrativ/Archiv/GV100ADQ/GV100AD${path}.zip?__blob=publicationFile`;
    console.debug('latestUrl', downloadUrl);
    return downloadUrl;
}

