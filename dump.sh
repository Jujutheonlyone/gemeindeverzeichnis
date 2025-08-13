export PGHOST=localhost
export PGPORT=5432
export PGUSER=gvuser
export PGPASSWORD=changeme
export PGDATABASE=gvdb

# 1) Datenbankdump im Custom-Format (-Fc) -> ideal für pg_restore
pg_dump --schema-only --schema=gv -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -Fc -f gvdb_$(date +%F).dump

# (optional) Checksum zum Verifizieren
shasum -a 256 gvdb_$(date +%F).dump > gvdb_$(date +%F).dump.sha256