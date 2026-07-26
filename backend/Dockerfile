# ============================================
# Stage 1: Build NestJS Application
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============================================
# Stage 2: Production Node Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled dist from builder stage
COPY --from=builder /app/dist ./dist

# Security Hardening: Run as non-root node user
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => { if (r.statusCode !== 200) process.exit(1); })"

CMD ["node", "dist/main"]
