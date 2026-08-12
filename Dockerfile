FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY server ./server

EXPOSE 5000

CMD ["node", "server/index.js"]