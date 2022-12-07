import chalk from "chalk";
import { ActivityType } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class ShardResumeListener extends KaikiListener {
    constructor() {
        super("shardResume", {
            event: "shardResume",
            emitter: "client",
        });
    }

    // Emitted when a shard resumes successfully.

    public async exec(id: number, replayedEvents: number): Promise<void> {

        logger.info(`shardResume | Shard: ${chalk.green(id)} \nReplayed ${chalk.green(replayedEvents)} events.`);

        await this.client.setPresence();
    }
}
