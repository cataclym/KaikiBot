import { Listener } from "@cataclym/discord-akairo";

export default class ShardReconnectingListener extends Listener {
	constructor() {
		super("shardReconnecting", {
			event: "shardReconnecting",
			emitter: "client",
		});
	}
	// Emitted when a shard is attempting to reconnect or re-identify.

	public async exec(id: number): Promise<void> {

		console.warn(`🟧 shardReconnecting | Shard: ${id}`);

	}
}
