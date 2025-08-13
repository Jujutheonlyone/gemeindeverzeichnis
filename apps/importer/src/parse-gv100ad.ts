import { readFileSync } from 'fs';
import {BaseRecord, GvRecord, R10, R20, R30, R40, R50, R60} from "./types";

function slice(line: string, from: number, to: number): string {
    // 1-basierte inklusiv-Positionen gemäß Datensatzbeschreibung
    return line.slice(from - 1, to).trim();
}

function parseIntSafe(s: string): number | undefined {
    const t = s.replace(/\D+/g, '');
    if (!t) return undefined;
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : undefined;
}

function parseBase(line: string): BaseRecord {
    const satzart = slice(line, 1, 2);
    const jahr = slice(line, 3, 6);
    const monat = slice(line, 7, 8);
    const tag = slice(line, 9, 10);
    const ars = slice(line, 11, 18);
    return { satzart, gebietsstand: { jahr, monat, tag }, ars };
}

function parse10(line: string): R10 {
    const base = parseBase(line);
    return {
        ...base,
        typ: 'land',
        land: slice(line, 11, 12),
        bezeichnung: slice(line, 23, 72),
        regierungssitz: slice(line, 73, 122),
    };
}

function parse20(line: string): R20 {
    const base = parseBase(line);
    return {
        ...base,
        typ: 'regierungsbezirk',
        land: slice(line, 11, 12),
        regbez: slice(line, 13, 13),
        bezeichnung: slice(line, 23, 72),
        verwaltungssitz: slice(line, 73, 122),
    };
}

function parse30(line: string): R30 {
    const base = parseBase(line);
    return {
        ...base,
        typ: 'region',
        land: slice(line, 11, 12),
        regbez: slice(line, 13, 13),
        region: slice(line, 14, 15),
        bezeichnung: slice(line, 23, 72),
        verwaltungssitz: slice(line, 73, 122),
    };
}

function parse40(line: string): R40 {
    const base = parseBase(line);
    const textkenn = slice(line, 123, 124) as R40['textkennzeichen'];
    return {
        ...base,
        typ: 'kreis',
        land: slice(line, 11, 12),
        regbez: slice(line, 13, 13),
        kreis: slice(line, 14, 15),
        bezeichnung: slice(line, 23, 72),
        verwaltungssitz: slice(line, 73, 122),
        textkennzeichen: textkenn || undefined,
    };
}

function parse50(line: string): R50 {
    const base = parseBase(line);
    const textkenn = slice(line, 123, 124) as R50['textkennzeichen'];
    return {
        ...base,
        typ: 'gemeindeverband',
        land: slice(line, 11, 12),
        regbez: slice(line, 13, 13),
        kreis: slice(line, 14, 15),
        gemeindeverband: slice(line, 19, 22),
        bezeichnung: slice(line, 23, 72),
        verwaltungssitz: slice(line, 73, 122),
        textkennzeichen: textkenn || undefined,
    };
}

function parse60(line: string): R60 {
    const base = parseBase(line);
    const textkenn = slice(line, 123, 124) as R60['textkennzeichen'];
    const plzMehr = slice(line, 171, 175); // leer = eindeutig
    return {
        ...base,
        typ: 'gemeinde',
        land: slice(line, 11, 12),
        regbez: slice(line, 13, 13),
        kreis: slice(line, 14, 15),
        gemeinde: slice(line, 16, 18),
        gemeindeverband: slice(line, 19, 22),
        bezeichnung: slice(line, 23, 72),
        flaeche_ha: parseIntSafe(slice(line, 129, 139)),
        einwohner_insgesamt: parseIntSafe(slice(line, 140, 150)),
        einwohner_maennlich: parseIntSafe(slice(line, 151, 161)),
        plz: slice(line, 166, 170) || undefined,
        plz_mehrdeutig: plzMehr ? true : false,
        finanzamtsbezirk: slice(line, 178, 181) || undefined,
        gericht_olg: slice(line, 182, 182) || undefined,
        gericht_lg: slice(line, 183, 183) || undefined,
        gericht_ag: slice(line, 184, 185) || undefined,
        arbeitsagentur: slice(line, 186, 190) || undefined,
        btwk_von: slice(line, 191, 193) || undefined,
        btwk_bis: slice(line, 194, 196) || undefined,
        textkennzeichen: textkenn || undefined,
    };
}

export function parseGv100adTxt(txtPath: string) {
    const content = readFileSync(txtPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);

    const out: GvRecord[] = [];
    for (const line of lines) {
        // GV100AD nutzt feste Satzlänge 220; Zeilen, die kürzer/lang sind, überspringen wir defensiv
        if (line.length < 2) continue;
        const sa = line.slice(0, 2);
        switch (sa) {
            case '10': out.push(parse10(line)); break;
            case '20': out.push(parse20(line)); break;
            case '30': out.push(parse30(line)); break;
            case '40': out.push(parse40(line)); break;
            case '50': out.push(parse50(line)); break;
            case '60': out.push(parse60(line)); break;
            default:
                // notfalls als unknown durchreichen
                out.push({ ...parseBase(line) } as GvRecord);
        }
    }
    return out;
}
