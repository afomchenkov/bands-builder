FROM node:18-alpine as build

COPY package.json .
COPY package-lock.json .

COPY . .

RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]