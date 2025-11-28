FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 9000

ENV MONGO_URI=""

CMD ["npm", "start"]