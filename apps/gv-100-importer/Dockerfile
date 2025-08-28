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
WORKDIR /app
# optional: timezone data (only if you need correct local time handling)
RUN apk add --no-cache tzdata
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
# security: run as non-root (ensure no writes outside /app)
RUN addgroup -g 1001 -S nodegrp && adduser -S node -u 1001 -G nodegrp && chown -R node:node /app
USER node
CMD ["node","dist/index.js"]
