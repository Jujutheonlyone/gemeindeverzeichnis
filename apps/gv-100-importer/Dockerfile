# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime ----
FROM node:20-alpine
ENV NODE_ENV=production TZ=Europe/Berlin
# wir arbeiten im Home des node-Users
WORKDIR /home/node/app
RUN apk add --no-cache tzdata

# Alles dem node-User geben
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node --from=builder /app/dist ./dist

# tmp-Ordner anlegen (gehört node)
RUN mkdir -p .tmp && chown -R node:node /home/node/app

USER node
CMD ["node","dist/index.js"]
