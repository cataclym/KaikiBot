FROM node:18
LABEL authors="Ole"

WORKDIR /kaikibot
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]