FROM node:18
LABEL authors="Ole"

WORKDIR /kaikibot
COPY package*.json .
RUN npm install
COPY prisma .
RUN npx prisma generate
COPY . .
RUN npm run build
CMD ["./external/dockerStart.sh"]
