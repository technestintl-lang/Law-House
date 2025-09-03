# Base Node.js image
FROM node:16-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install dependencies for shared package
FROM base AS shared-deps
WORKDIR /app/shared
COPY shared/package*.json ./
RUN npm ci

# Build shared package
FROM shared-deps AS shared-builder
WORKDIR /app/shared
COPY shared/. .
RUN npm run build

# Install dependencies for backend
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci

# Build backend
FROM backend-deps AS backend-builder
WORKDIR /app/backend
COPY backend/. .
COPY --from=shared-builder /app/shared /app/shared
RUN npm run build

# Install dependencies for frontend
FROM base AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

# Build frontend
FROM frontend-deps AS frontend-builder
WORKDIR /app/frontend
COPY frontend/. .
COPY --from=shared-builder /app/shared /app/shared
RUN npm run build

# Production image for backend
FROM base AS backend-prod
WORKDIR /app
ENV NODE_ENV production
COPY --from=backend-builder /app/backend/dist /app/dist
COPY --from=backend-builder /app/backend/node_modules /app/node_modules
COPY --from=shared-builder /app/shared/dist /app/shared/dist

# Copy frontend build to backend public folder
COPY --from=frontend-builder /app/frontend/.next/static /app/public/static
COPY --from=frontend-builder /app/frontend/public /app/public

EXPOSE 3001
CMD ["node", "dist/main"]

