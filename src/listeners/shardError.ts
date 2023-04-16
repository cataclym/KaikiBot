import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "shardError",
})
export default class ShardError extends KaikiListener {

    // Emitted whenever a shard's WebSocket encounters a connection error.
    public async run(error: Error, id: number): Promise<void> {
        logger.error(`shardError | Shard: ${chalk.redBright(id)} \n${error.stack || error}`);
    }
}
