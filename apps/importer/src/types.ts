export type BaseRecord = {
    satzart: string;           // "10" | "20" | "30" | "40" | "50" | "60"
    gebietsstand: { jahr: string; monat: string; tag: string };
    ars: string;               // Amtlicher Regionalschlüssel (11-18)
};

export type R10 = BaseRecord & {
    typ: 'land';
    land: string;              // 11-12
    bezeichnung: string;       // 23-72
    regierungssitz: string;    // 73-122
};

export type R20 = BaseRecord & {
    typ: 'regierungsbezirk';
    land: string;              // 11-12
    regbez: string;            // 13
    bezeichnung: string;       // 23-72
    verwaltungssitz: string;   // 73-122
};

export type R30 = BaseRecord & {
    typ: 'region';             // nur BW
    land: string;              // 11-12
    regbez: string;            // 13
    region: string;            // 14-15 (praktisch Stelle 14)
    bezeichnung: string;       // 23-72
    verwaltungssitz: string;   // 73-122
};

export type R40 = BaseRecord & {
    typ: 'kreis';
    land: string;              // 11-12
    regbez: string;            // 13
    kreis: string;             // 14-15
    bezeichnung: string;       // 23-72
    verwaltungssitz: string;   // 73-122
    textkennzeichen?: '41'|'42'|'43'|'44'|'45'; // 123-124 (41=Kreisfreie Stadt, 42=Stadtkreis, 43=Kreis, 44=Landkreis, 45=Regionalverband)
};

export type R50 = BaseRecord & {
    typ: 'gemeindeverband';
    land: string;              // 11-12
    regbez: string;            // 13
    kreis: string;             // 14-15
    gemeindeverband: string;   // 19-22
    bezeichnung: string;       // 23-72
    verwaltungssitz: string;   // 73-122
    textkennzeichen?: '50'|'51'|'52'|'53'|'54'|'55'|'56'|'57'|'58'; // 123-124 (siehe Legende)
};

export type R60 = BaseRecord & {
    typ: 'gemeinde';
    land: string;              // 11-12
    regbez: string;            // 13
    kreis: string;             // 14-15
    gemeinde: string;          // 16-18
    gemeindeverband: string;   // 19-22
    bezeichnung: string;       // 23-72
    flaeche_ha?: number;       // 129-139 (NOV11K00)
    einwohner_insgesamt?: number; // 140-150
    einwohner_maennlich?: number; // 151-161
    plz?: string;              // 166-170
    plz_mehrdeutig?: boolean;  // 171-175 (leer = eindeutig, sonst mehrere PLZ)
    finanzamtsbezirk?: string; // 178-181
    gericht_olg?: string;      // 182
    gericht_lg?: string;       // 183
    gericht_ag?: string;       // 184-185
    arbeitsagentur?: string;   // 186-190
    btwk_von?: string;         // 191-193
    btwk_bis?: string;         // 194-196
    textkennzeichen?: '60'|'61'|'62'|'63'|'64'|'65'|'66'|'67'; // 123-124 (siehe Legende)
};

export type GvRecord = R10 | R20 | R30 | R40 | R50 | R60;