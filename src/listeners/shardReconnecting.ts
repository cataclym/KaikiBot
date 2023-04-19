import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import logger from "loglevel";

@ApplyOptions<ListenerOptions>({
    event: "shardReconnecting",
})
export default class ShardReconnecting extends Listener {

    // Emitted when a shard is attempting to reconnect or re-identify.
    public async run(id: number): Promise<void> {

        logger.info(`shardReconnecting | Shard: ${chalk.green(id)}`);
    }
}
