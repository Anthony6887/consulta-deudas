# ===============================
# ETAPA 1: Build
# ===============================
FROM node:18-alpine AS builder

WORKDIR /app

# Dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Código fuente
COPY . .

# Build Next
RUN npm run build


# ===============================
# ETAPA 2: Producción
# ===============================
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copiar solo lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Puerto expuesto
EXPOSE 3001

# Arranque en puerto 3001
CMD ["npm", "start", "--", "-p", "3001"]
