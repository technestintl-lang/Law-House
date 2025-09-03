FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared package
RUN npm run build:shared

# Build backend
RUN npm run build:backend

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/dist/main.js"]

