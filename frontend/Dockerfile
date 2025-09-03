FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared package
RUN npm run build:shared

# Build frontend
RUN npm run build:frontend

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/next.config.js ./frontend/

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]

