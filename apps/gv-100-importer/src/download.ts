import axios from 'axios';
import { createWriteStream, mkdirSync } from 'fs';
import { basename, join } from 'path';

export async function downloadZip(url: string, outDir = '.tmp'): Promise<string> {
    mkdirSync(outDir, { recursive: true });
    const filename = basename(new URL(url).pathname) || 'gv100ad.zip';
    const outPath = join(outDir, filename);

    const res = await axios.get(url, { responseType: 'stream', maxRedirects: 5 });
    await new Promise<void>((resolve, reject) => {
        const ws = createWriteStream(outPath);
        res.data.pipe(ws);
        res.data.on('error', reject);
        ws.on('finish', resolve);
        ws.on('error', reject);
    });

    return outPath;
}
