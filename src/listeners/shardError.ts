import { Listener } from "@cataclym/discord-akairo";
import logger from "loglevel";


export default class ShardErrorListener extends Listener {
	constructor() {
		super("shardError", {
			event: "shardError",
			emitter: "client",
		});
	}
	// Emitted whenever a shard's WebSocket encounters a connection error.

	public async exec(error: Error, id: number): Promise<void> {

		logger.error(`shardError | Shard: ${id} \n${error.stack ? error.stack : error}`);

	}
}
