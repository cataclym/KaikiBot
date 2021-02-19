import { Listener } from "@cataclym/discord-akairo";
import { logger } from "../nsb/Logger";

export default class ShardReadyListener extends Listener {
	constructor() {
		super("shardReady", {
			event: "shardReady",
			emitter: "client",
		});
	}
	// Emitted when a shard turns ready.

	public async exec(id: number, unavailableGuilds: Set<string> | undefined): Promise<void> {
		const arr = [`shardReady | Shard: ${id}`];
		if (unavailableGuilds?.size) {
			for await (const [k, v] of unavailableGuilds) {
				arr.push(`${k}: ${v}`);
			}
		}
		logger.low(arr.join("\n"));

	}
}
