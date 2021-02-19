import { Listener } from "@cataclym/discord-akairo";
import { logger } from "../nsb/Logger";

export default class ShardDisconnectListener extends Listener {
	constructor() {
		super("shardDisconnect", {
			event: "shardDisconnect",
			emitter: "client",
		});
	}
	// Emitted when a shard's WebSocket disconnects and will no longer reconnect.

	public async exec(event: CloseEvent, id: number): Promise<void> {

		logger.medium(`ShardDisconnect | Shard: ${id} Reason: ${event.reason}`);
	}
}
