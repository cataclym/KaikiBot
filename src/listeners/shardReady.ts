import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import { Snowflake } from "discord.js";
import logger from "loglevel";

@ApplyOptions<ListenerOptions>({
    event: "shardReady",
})
export default class ShardReady extends Listener {

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
