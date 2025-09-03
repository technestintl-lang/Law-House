# Base Node.js image
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package.json files for all workspaces
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Create workspace structure
RUN mkdir -p backend/src frontend/src shared/src

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared package first
RUN npm run build:shared

# Build backend and frontend
RUN npm run build:backend
RUN npm run build:frontend

# Production image
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV production

# Copy package.json files
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install production dependencies
RUN npm install --omit=dev

# Copy built files from base stage
COPY --from=base /app/shared/dist ./shared/dist
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/frontend/public ./frontend/public
COPY --from=base /app/frontend/next.config.js ./frontend/

# Expose ports
EXPOSE 3000 3001

# Start both services (using a shell script)
RUN echo '#!/bin/sh\nnode backend/dist/main.js &\ncd frontend && npm run start' > /app/start.sh
RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]
