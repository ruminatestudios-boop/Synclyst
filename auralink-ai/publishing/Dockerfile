# SyncLyst Publishing API — Node.js for Cloud Run
FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# App
COPY src/ ./src/

# Cloud Run sets PORT (default 8080)
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]
