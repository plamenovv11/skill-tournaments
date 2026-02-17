FROM node:20-alpine


WORKDIR /app

# Copy shared types as sibling directory
COPY shared/ ./shared/

# Setup service in subdirectory
WORKDIR /app/tournament-service

COPY tournament-service/package*.json ./

RUN npm install

COPY tournament-service/ .


RUN npm run build

# Flatten dist folder structure if nested
RUN if [ -d "dist/tournament-service/src" ]; then \
      cp -r dist/tournament-service/src/* dist/ && rm -rf dist/tournament-service; \
    elif [ -d "dist/src" ]; then \
      cp -r dist/src/* dist/ && rm -rf dist/src; \
    fi

CMD ["npm", "run", "start:prod"]
