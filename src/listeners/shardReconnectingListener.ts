import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "shardReconnecting",
})
export default class ShardReconnectingListener extends KaikiListener {

    // Emitted when a shard is attempting to reconnect or re-identify.
    public async run(id: number): Promise<void> {

        logger.info(`shardReconnecting | Shard: ${chalk.green(id)}`);

    }
}
