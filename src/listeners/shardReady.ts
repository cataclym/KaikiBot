import { Listener } from "discord-akairo";
import logger from "loglevel";
import chalk from "chalk";


export default class ShardReadyListener extends Listener {
    constructor() {
        super("shardReady", {
            event: "shardReady",
            emitter: "client",
        });
    }
    // Emitted when a shard turns ready.

    public async exec(id: number, unavailableGuilds?: Set<string>): Promise<void> {
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
