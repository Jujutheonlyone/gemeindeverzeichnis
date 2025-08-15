# syntax=docker/dockerfile:1.7-labs

############################
# Stage 1: Build (immer amd64)
############################
FROM --platform=linux/amd64 node:20-bookworm AS build

# Tools + evtl. System-Binaries (falls deine Gulp-Tasks sie verwenden)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git python3 make g++ autoconf automake libtool pkg-config \
    gifsicle optipng pngquant webp \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Nur Lock/Manifest zuerst kopieren (Cache ausnutzen)
COPY package.json package-lock.json* yarn.lock* ./

# 👉 WICHTIG: optionale Binär-Abhängigkeiten (gifsicle/optipng-bin etc.) NICHT installieren
ENV SKIP_DOWNLOAD=1 GIFSICLE_SKIP_DOWNLOAD=1 OPTIPNG_BIN_SKIP_DOWNLOAD=1
RUN npm ci --no-audit --no-fund --omit=optional

# Projektdateien kopieren & bauen (gulp)
COPY . .
RUN npm run build || npx gulp build

############################
# Stage 2: Runtime (Target-Arch)
############################
FROM --platform=$TARGETPLATFORM nginx:1.27-bookworm

# Eigene Nginx-Config
COPY nginx.conf /etc/nginx/nginx.conf

# Statisches Build in den Webroot
COPY --from=build /app/build/ /usr/share/nginx/html/

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

EXPOSE 80
