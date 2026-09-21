# Multi-stage build for optimal image size and security

# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Serve production assets with Nginx
FROM nginx:alpine

# Copy built static assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing and compression
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port (Render detects this automatically)
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

