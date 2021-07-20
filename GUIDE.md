
## Requirements
* Nodejs https://nodejs.org/en/ (14.16.0 for best compatibility)
* TypeScript `sudo npm install -g typescript` https://www.npmjs.com/package/typescript
* node-canvas: **This is only necessary if your npm install tries to compile node-canvas from source.**
    * (Windows) See the <a href="https://github.com/Automattic/node-canvas/wiki/Installation:-Windows">wiki</a>
    * (Linux)
        * Debian/Ubuntu: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
        * RPM/Fedora: `sudo yum install gcc-c++ cairo-devel libjpeg-turbo-devel pango-devel giflib-devel`
        * Solus: `sudo eopkg it libjpeg-turbo6 libjpeg-turbo-devel`
        * Other: See the <a href="https://github.com/Automattic/node-canvas/wiki">wiki</a>
    * (MacOS)
        * Homebrew: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`

## Instructions

1. Clone repo: `git clone https://gitlab.com/cataclym/KaikiDeishuBot.git`
1. `cd KaikiDeishuBot`
1. Create .env file: `cp .env.example .env`.
1. Edit .env to add your token and owner id. Using nano or your editor of choice: `nano .env` [Full instructions](./ENV.md)
1. `npm i`
1. `npm start`
1. ?
1. Profit

Having issues? Come join us on discord

<a href="https://discord.gg/8G3AqjnFfX">
<img src="https://discord.com/api/guilds/794671071886049280/embed.png?style=banner3" title="Discord Server">
</a>

***

You can use the following link to invite your bot: Replace `YOUR_BOT_ID_HERE` with your bot id/client id.
https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID_HERE&scope=bot