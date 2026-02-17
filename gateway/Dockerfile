FROM node:20-alpine


WORKDIR /app

COPY shared/ ./shared/

WORKDIR /app/gateway

COPY gateway/package*.json ./

RUN npm install

COPY gateway/ .


RUN npm run build

RUN if [ -d "dist/gateway/src" ]; then \
      cp -r dist/gateway/src/* dist/ && rm -rf dist/gateway; \
    elif [ -d "dist/src" ]; then \
      cp -r dist/src/* dist/ && rm -rf dist/src; \
    fi

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
