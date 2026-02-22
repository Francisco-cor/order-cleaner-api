# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code and other necessary files for build
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
