import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "shardResume",
})
export default class ShardResume extends KaikiListener {

    // Emitted when a shard resumes successfully.
    public async run(id: number, replayedEvents: number): Promise<void> {

        logger.info(`shardResume | Shard: ${chalk.green(id)} \nReplayed ${chalk.green(replayedEvents)} events.`);

        await this.client.setPresence();
    }
}
