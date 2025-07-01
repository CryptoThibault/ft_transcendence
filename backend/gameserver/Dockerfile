FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 6001

CMD ["node", "dist/server.js"]