import { MessageEmbed } from "discord.js";
import logger from "loglevel";
import { excludeData } from "../lib/slashCommands/data";
import chalk from "chalk";
import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class ReadyListener extends KaikiListener {
    constructor() {
        super("ready", {
            event: "ready",
            emitter: "client",
            type: "once",
        });
    }

    public async exec(): Promise<void> {

        // Find all guilds that have dad-bot enabled
        const enabled = await this.client.orm.guilds.findMany({
            where: {
                DadBot: true,
            },
            select: {
                Id: true,
            },
        });

        // Create slash commands in those guilds
        enabled.forEach(g => {
            this.client.guilds.cache.get(String(g.Id))?.commands.create(excludeData)
            // Ignore the unhandled rejection
                .catch(() => null);
        });

        logger.info(`Created slash commands in ${chalk.green(enabled.length)} guilds.`);

        this.client.initializeServices()
            .then(() => logger.info("Daily reset timer initiated!"));

        // Let bot owner know when bot goes online.
        if (this.client.user && ["Tsukihi Araragi#3589", "Kaiki Deishū#9185"].includes(this.client.user.tag)) {
            // Inconspicuous emotes haha
            const emoji = ["✨", "♥️", "✅", "🇹🇼"][Math.floor(Math.random() * 4)];
            await this.client.owner.send({ embeds:
                    [new MessageEmbed()
                        .setDescription("Bot is online!")
                        .setAuthor({ name: emoji })
                        .withOkColor(),
                    ],
            });
        }

        const botDb = await this.client.orm.botSettings.findFirst();
        this.client.user?.setPresence({
            activities: [{
                name: botDb?.Activity || undefined,
                type: botDb?.ActivityType || undefined,
            }],
        });
    }
}
