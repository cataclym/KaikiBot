FROM node:18
LABEL authors="Ole"

WORKDIR /kaikibot
RUN apt update && apt install neofetch -y
COPY package*.json .
RUN npm install
COPY prisma .
RUN npx prisma generate
COPY . .
RUN npm run build
CMD ["npm", "run", "start_docker"]
