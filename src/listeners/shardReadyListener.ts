import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import { Snowflake } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "shardReady",
})
export default class ShardReadyListener extends KaikiListener {

    // Emitted when a shard turns ready.
    public async run(id: number, unavailableGuilds?: Set<Snowflake>): Promise<void> {
        const arr = [`shardReady | Shard: ${chalk.green(id)}`];
        if (unavailableGuilds?.size) {
            arr.push("Unavailable guilds:");
            unavailableGuilds.forEach((v1, v2) => {
                arr.push(`${v1}: ${v2}`);
            });
        }
        logger.info(arr.join("\n"));
    }
}
