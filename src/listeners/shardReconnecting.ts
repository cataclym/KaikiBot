import { Listener } from "discord-akairo";
import logger from "loglevel";
import chalk from "chalk";


export default class ShardReconnectingListener extends Listener {
    constructor() {
        super("shardReconnecting", {
            event: "shardReconnecting",
            emitter: "client",
        });
    }
    // Emitted when a shard is attempting to reconnect or re-identify.

    public async exec(id: number): Promise<void> {

        logger.info(`shardReconnecting | Shard: ${chalk.green(id)}`);

    }
}
