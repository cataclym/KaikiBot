import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "shardDisconnect",
})
export default class ShardDisconnectListener extends KaikiListener {

    // Emitted when a shard's WebSocket disconnects and will no longer reconnect.
    public async run(event: CloseEvent, id: number) {

        logger.warn(`ShardDisconnect | Shard: ${chalk.redBright(id)} Reason: ${event.reason}`);
    }
}
