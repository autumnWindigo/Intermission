# Frontend Dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]  # Or the frontend start command
