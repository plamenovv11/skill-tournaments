FROM node:20-alpine

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy shared types as sibling directory
COPY shared/ ./shared/

# Setup service in subdirectory
WORKDIR /app/user-service

# Copy package files
COPY user-service/package*.json ./

RUN npm install

# Copy source code
COPY user-service/ .

# Build application
RUN npm run build

# Flatten dist folder structure if nested
RUN if [ -d "dist/user-service/src" ]; then \
      cp -r dist/user-service/src/* dist/ && rm -rf dist/user-service; \
    elif [ -d "dist/src" ]; then \
      cp -r dist/src/* dist/ && rm -rf dist/src; \
    fi

# Start the application
CMD ["npm", "run", "start:prod"]
