import { Listener } from "@cataclym/discord-akairo";
import logger from "loglevel";


export default class ShardDisconnectListener extends Listener {
	constructor() {
		super("shardDisconnect", {
			event: "shardDisconnect",
			emitter: "client",
		});
	}
	// Emitted when a shard's WebSocket disconnects and will no longer reconnect.

	public async exec(event: CloseEvent, id: number): Promise<void> {

		logger.warn(`ShardDisconnect | Shard: ${id} Reason: ${event.reason}`);
	}
}
