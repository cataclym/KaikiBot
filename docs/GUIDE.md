### Paths

-   [Readme](../README.md)
-   Docs
    -   [.env setup](ENV.md)

## Requirements

-   Linux (Can work on other OS, but not supported)
-   Node.js v16.6 (or newer) https://nodejs.org/en/
-   MySQL

## Instructions

1. Clone repo: `git clone https://gitlab.com/cataclym/KaikiDeishuBot.git && cd KaikiDeishuBot`
2. Create .env file: `cp .env.example .env`.
3. Edit .env to add your token and owner id. Using nano or your editor of choice: `nano .env` then follow the [full instructions](ENV.md)!
4. Install dependencies: `npm i`
5. Run the compiler: `npm run build`
6. Run the program: `npm run start`
7. ?
8. Profit

Having issues? Come join us on discord

<a href="https://discord.gg/8G3AqjnFfX">
    <img src="https://discord.com/api/guilds/794671071886049280/embed.png?style=banner3" title="Discord Server" alt="Kaiki invite link">
</a>

---

# Inviting your bot

First make sure you have created a bot application. Learn how to [here](ENV.md).

You can use the following link to invite your bot: Replace `YOUR_BOT_ID_HERE` with your bot id/client id.

https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID_HERE&scope=bot
