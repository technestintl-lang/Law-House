# Base Node.js image
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

# Copy root package.json for workspaces
COPY package.json ./

# Install dependencies for shared package
FROM base AS shared-deps
WORKDIR /app
COPY shared/package.json ./shared/
RUN mkdir -p shared/src
RUN npm install

# Build shared package
FROM shared-deps AS shared-builder
WORKDIR /app
COPY shared/. ./shared/
RUN npm run build:shared

# Install dependencies for backend
FROM base AS backend-deps
WORKDIR /app
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
RUN mkdir -p backend/src shared/src
RUN npm install

# Build backend
FROM backend-deps AS backend-builder
WORKDIR /app
COPY backend/. ./backend/
COPY shared/. ./shared/
COPY --from=shared-builder /app/shared/dist ./shared/dist
RUN npm run build:backend

# Install dependencies for frontend
FROM base AS frontend-deps
WORKDIR /app
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/
RUN mkdir -p frontend/src shared/src
RUN npm install

# Build frontend
FROM frontend-deps AS frontend-builder
WORKDIR /app
COPY frontend/. ./frontend/
COPY shared/. ./shared/
COPY --from=shared-builder /app/shared/dist ./shared/dist
RUN npm run build:frontend

# Production image for backend
FROM node:18-alpine AS backend-prod
WORKDIR /app
ENV NODE_ENV production

# Install production dependencies
COPY package.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
RUN npm install --omit=dev

# Copy built files
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=shared-builder /app/shared/dist ./shared/dist

# Copy frontend build to backend public folder
COPY --from=frontend-builder /app/frontend/.next/static ./backend/public/static
COPY --from=frontend-builder /app/frontend/public ./backend/public

EXPOSE 3000
CMD ["node", "backend/dist/main.js"]

# Production image for frontend
FROM node:18-alpine AS frontend-prod
WORKDIR /app
ENV NODE_ENV production

# Install production dependencies
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/
RUN npm install --omit=dev

# Copy built files
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/
COPY --from=shared-builder /app/shared/dist ./shared/dist

EXPOSE 3001
CMD ["npm", "run", "start"]
