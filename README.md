# gemeindeverzeichnis-importer (MVP)

CLI-Tool, das die neueste GV100AD findet, herunterlädt, entpackt, als Rohzeilen parst und in `gv_staging` importiert.

## Setup

```bash
cd apps/importer
npm i
# env, z. B. in repo-root .env
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=gvuser
export DB_PASSWORD=changeme
export DB_NAME=gvdb
```

**DB-Voraussetzung:**
```sql
CREATE TABLE IF NOT EXISTS gv_staging (
  stichtag date not null,
  satzart  text not null,
  raw      text not null
);
```

## Run

```bash
# Dev (TS direkt)
npm run dev

# oder build & run
npm run build
npm start
```

### Manuelles Override
Falls Auto-Discovery hakt, kannst du direkt eine ZIP-URL setzen:
```bash
export GV100AD_ZIP_URL="https://…/GV100AD_31052025.zip"
npm run dev
```

## Nächste Schritte
- Mapping der 220-Stellen-Satzarten → Normalformen (state/district/municipality)
- Idempotenter Import (SHA/ETag-Check, Duplicate Guard)
- Tests

juliansunten@Mac gemeindeverzeichnis % docker tag gemeindeverzeichnis-api:0.1.0 ghcr.io/jujutheonlyone/gemeindeverzeichnis-api:latest

juliansunten@Mac gemeindeverzeichnis % docker push ghcr.io/jujutheonlyone/gemeindeverzeichnis-api:latest
