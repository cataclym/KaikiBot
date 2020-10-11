import { Listener } from "discord-akairo";

export default class ShardDisconnectListener extends Listener {
	constructor() {
		super("shardDisconnect", {
			event: "shardDisconnect",
			emitter: "client",
		});
	}
	// Emitted when a shard's WebSocket disconnects and will no longer reconnect.

	public async exec(event: CloseEvent, id: number): Promise<void> {

		console.warn(
			// eslint-disable-next-line indent
	`🟥 ShardDisconnect | Shard: ${id} Reason: ${event.reason}`);

	}
}
