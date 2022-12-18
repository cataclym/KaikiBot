import chalk from "chalk";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import { excludeData } from "../lib/SlashCommands/data";

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
            .then(() => logger.info("DailyResetTimer | Service initiated"));
    }
}
