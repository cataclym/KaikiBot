FROM node:18
LABEL authors="Ole"

WORKDIR /Kaiki-Deishu-Bot
COPY package.json .
RUN npm install
COPY . .
CMD npm start