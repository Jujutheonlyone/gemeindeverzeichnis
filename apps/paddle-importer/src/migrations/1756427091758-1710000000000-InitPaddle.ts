import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Erstellt Schema "gv" (falls nicht vorhanden) und die Tabelle gv.paddle_courts
 * inkl. Sequence/Default, PK, Unique(website) und Indizes auf name/zip – gem. Dump.
 */
export class InitPaddleCourts1710000000000 implements MigrationInterface {
    name = "InitPaddleCourts1710000000000";

    public async up(q: QueryRunner): Promise<void> {
        // Schema anlegen
        await q.query(`
      CREATE SCHEMA IF NOT EXISTS gv;
    `);

        // Sequence (IF NOT EXISTS = idempotent)
        await q.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE c.relkind = 'S' AND c.relname = 'paddle_courts_id_seq' AND n.nspname = 'gv'
        ) THEN
          CREATE SEQUENCE gv.paddle_courts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        END IF;
      END$$;
    `);

        // Tabelle
        await q.query(`
      CREATE TABLE IF NOT EXISTS gv.paddle_courts (
        id                   integer NOT NULL,
        website              text    NOT NULL,
        phone                text,
        email                text,
        street               text,
        zip                  text,
        name                 text    NOT NULL,
        indoor_courts_count  integer NOT NULL DEFAULT 0,
        outdoor_courts_count integer NOT NULL DEFAULT 0,
        single_courts_count  integer NOT NULL DEFAULT 0,
        description          text,
        updated_at           timestamptz NOT NULL DEFAULT now(),
        created_at           timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT paddle_courts_pkey PRIMARY KEY (id),
        CONSTRAINT paddle_courts_website_key UNIQUE (website)
      );
    `);

        // Default der id-Spalte auf Sequence setzen (entspricht deinem Dump)
        await q.query(`
      ALTER TABLE gv.paddle_courts
      ALTER COLUMN id SET DEFAULT nextval('gv.paddle_courts_id_seq'::regclass);
    `);

        // Indizes wie im Dump
        await q.query(`CREATE INDEX IF NOT EXISTS idx_paddle_courts_name ON gv.paddle_courts (name);`);
        await q.query(`CREATE INDEX IF NOT EXISTS idx_paddle_courts_zip  ON gv.paddle_courts (zip);`);
    }

    public async down(q: QueryRunner): Promise<void> {
        // Indizes droppen
        await q.query(`DROP INDEX IF EXISTS gv.idx_paddle_courts_zip;`);
        await q.query(`DROP INDEX IF EXISTS gv.idx_paddle_courts_name;`);

        // Tabelle droppen
        await q.query(`DROP TABLE IF EXISTS gv.paddle_courts;`);

        // Sequence droppen
        await q.query(`DROP SEQUENCE IF EXISTS gv.paddle_courts_id_seq;`);

        // Schema gv NICHT zwangsläufig löschen (könnte weitere Objekte enthalten).
        // Wenn du es wirklich leeren willst, könntest du hier optional:
        // await q.query('DROP SCHEMA IF EXISTS gv CASCADE;');
    }
}
