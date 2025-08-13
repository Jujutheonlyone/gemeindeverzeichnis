import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({ schema: 'gv', name: 'municipality' })
export class Municipality {
    @PrimaryColumn({ type: 'char', length: 8, name: 'ars' })
    ars!: string;

    @Column({ type: 'date', name: 'gebietsstand' })
    gebietsstand!: string; // Stichtag

    @Column({ type: 'text', name: 'name' })
    name!: string;

    @Column({ type: 'char', length: 2, name: 'land' })
    land!: string; // Landes-ARS (2)

    @Column({ type: 'char', length: 1, name: 'regbez', nullable: true })
    regbez?: string | null; // Regierungsbezirk (1)

    @Column({ type: 'char', length: 2, name: 'kreis', nullable: true })
    kreis?: string | null; // Kreis (2)

    @Column({ type: 'char', length: 3, name: 'gemeinde_code', nullable: true })
    gemeindeCode?: string | null;

    @Column({ type: 'char', length: 4, name: 'gemeindeverband', nullable: true })
    gemeindeverband?: string | null;

    @Column({ type: 'char', length: 2, name: 'textkennzeichen', nullable: true })
    textkennzeichen?: string | null;

    @Column({ type: 'integer', name: 'flaeche_ha', nullable: true })
    flaecheHa?: number | null;

    @Column({ type: 'integer', name: 'einwohner_insgesamt', nullable: true })
    einwohnerInsgesamt?: number | null;

    @Column({ type: 'integer', name: 'einwohner_maennlich', nullable: true })
    einwohnerMaennlich?: number | null;

    @Column({ type: 'char', length: 5, name: 'plz', nullable: true })
    plz?: string | null;

    @Column({ type: 'boolean', name: 'plz_mehrdeutig', nullable: true })
    plzMehrdeutig?: boolean | null;

    @Column({ type: 'text', name: 'finanzamtsbezirk', nullable: true })
    finanzamtsbezirk?: string | null;

    @Column({ type: 'text', name: 'gericht_olg', nullable: true })
    gerichtOlg?: string | null;

    @Column({ type: 'text', name: 'gericht_lg', nullable: true })
    gerichtLg?: string | null;

    @Column({ type: 'text', name: 'gericht_ag', nullable: true })
    gerichtAg?: string | null;

    @Column({ type: 'text', name: 'arbeitsagentur', nullable: true })
    arbeitsagentur?: string | null;

    @Column({ type: 'text', name: 'btwk_von', nullable: true })
    btwkVon?: string | null;

    @Column({ type: 'text', name: 'btwk_bis', nullable: true })
    btwkBis?: string | null;

    @Column({ type: 'timestamptz', name: 'updated_at', nullable: true })
    updatedAt?: string | null;
}

@Entity({ schema: 'gv', name: 'state' })
export class State {
    @PrimaryColumn({ type: 'char', length: 2, name: 'ars2' })
    ars2!: string;

    @Column({ type: 'text', name: 'name' })
    name!: string;
}

@Entity({ schema: 'gv', name: 'kreis' })
export class Kreis {
    @PrimaryColumn({ type: 'char', length: 5, name: 'ars5' })
    ars5!: string;

    @Column({ type: 'char', length: 3, name: 'regbez_ars3', nullable: true })
    regbezArs3?: string | null;

    @Column({ type: 'char', length: 2, name: 'land_ars2', nullable: true })
    landArs2?: string | null;

    @Column({ type: 'text', name: 'name' })
    name!: string;

    @Column({ type: 'text', name: 'sitz', nullable: true })
    sitz?: string | null;

    @Column({ type: 'char', length: 2, name: 'textkennzeichen', nullable: true })
    textkennzeichen?: string | null;

    @Column({ type: 'boolean', name: 'is_special', nullable: true })
    isSpecial?: boolean | null;
}

@Entity({ schema: 'gv', name: 'regbez' })
export class Regbez {
    @PrimaryColumn({ type: 'char', length: 3, name: 'ars3' })
    ars3!: string;

    @Column({ type: 'char', length: 2, name: 'land_ars2', nullable: true })
    landArs2?: string | null;

    @Column({ type: 'text', name: 'name' })
    name!: string;
}

@Entity({ schema: 'gv', name: 'verband' })
export class Verband {
    @PrimaryColumn({ type: 'char', length: 4, name: 'ars4' })
    ars4!: string;

    @Column({ type: 'char', length: 5, name: 'kreis_ars5', nullable: true })
    kreisArs5?: string | null;

    @Column({ type: 'text', name: 'name' })
    name!: string;

    @Column({ type: 'text', name: 'sitz', nullable: true })
    sitz?: string | null;

    @Column({ type: 'char', length: 2, name: 'textkennzeichen', nullable: true })
    textkennzeichen?: string | null;
}

@Entity({ schema: 'gv', name: 'staging_json' })
export class StagingJson {
    @Column({ type: 'char', length: 2, name: 'satzart', primary: true })
    satzart!: string;

    @Column({ type: 'char', length: 8, name: 'ars', nullable: true })
    ars?: string | null;

    @Column({ type: 'date', name: 'gebietsstand', nullable: true })
    gebietsstand?: string | null;

    @Column({ type: 'jsonb', name: 'data' })
    data!: Record<string, unknown>;

    @Column({ type: 'timestamptz', name: 'ingested_at', nullable: true })
    ingestedAt?: string | null;
}