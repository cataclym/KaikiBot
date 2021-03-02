import { Listener } from "@cataclym/discord-akairo";
import logger from "loglevel";


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
			arr.push("Unavailable guilds:");
			for await (const [k, v] of unavailableGuilds) {
				arr.push(`${k}: ${v}`);
			}
		}
		logger.info(arr.join("\n"));

	}
}
