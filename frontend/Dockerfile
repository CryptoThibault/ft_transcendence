FROM node:20-alpine AS builder

WORKDIR /app

# Copy only what's needed to install dependencies
COPY package.json ./

RUN npm install

# Copy the rest of the source code
COPY . .

RUN chmod +x node_modules/.bin/vite

EXPOSE 3000

# Write the build-id.js file
ARG BUILD_DATE
RUN mkdir -p /app/dist && echo "window.buildId = '${BUILD_DATE}';" > /app/dist/build-id.js

# Build the production-ready frontend
CMD [ "npm", "run", "dev" ]