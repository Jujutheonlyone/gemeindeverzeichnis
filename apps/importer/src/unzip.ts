import AdmZip from 'adm-zip';
import { mkdirSync } from 'fs';
import { join } from 'path';

export function unzip(zipPath: string, outDir = '.tmp'): string {
    mkdirSync(outDir, { recursive: true });
    const zip = new AdmZip(zipPath);
    const entries = zip.getEntries();
    const files: string[] = [];
    for (const e of entries) {
        if (e.isDirectory) continue;
        const dest = join(outDir, e.entryName);
        zip.extractEntryTo(e, outDir, false, true);
        files.push(dest);
    }

    const txtFiles = files.filter(f => {
        const fileName = f.toLowerCase();
        return fileName.includes('gv100ad') && fileName.endsWith('.txt');
    });

    if (!txtFiles.length) {
        console.warn('Keine TXT-Dateien gefunden.');
    } else {
        txtFiles.forEach(f => console.log(' ', join(process.cwd(), f)));
    }

    return txtFiles[0];
}
