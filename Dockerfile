FROM node:20
LABEL authors="Ole"

WORKDIR /kaikibot
RUN apt update && curl -sLO https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb && dpkg -i fastfetch-linux-amd64.deb
COPY package*.json .
RUN npm install
COPY prisma .
RUN npx prisma generate
COPY . .
RUN npm run build
CMD ["npm", "run", "start_docker"]
