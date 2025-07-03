FROM node:20-alpine AS builder

WORKDIR /app

# Copy only what's needed to install dependencies
COPY package.json ./

RUN npm install

# Copy the rest of the source code
COPY . .

RUN chmod +x node_modules/.bin/vite

EXPOSE 3000

RUN mkdir -p /usr/share/nginx/html \
    && echo "window.resetFlag = true;" > /usr/share/nginx/html/reset-flag.js

# Build the production-ready frontend
CMD [ "npm","run","dev" ]

