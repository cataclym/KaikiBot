import { Listener } from "discord-akairo";

export default class ShardReadyListener extends Listener {
	constructor() {
		super("shardReady", {
			event: "shardReady",
			emitter: "client",
		});
	}
	// Emitted when a shard turns ready.

	public async exec(id: number, unavailableGuilds: Set<string> | undefined): Promise<void> {
		const arr: string[] = [];
		unavailableGuilds?.forEach((guild) => arr.push(guild));
		console.log(`🟩 shardReady | Shard: ${id}${unavailableGuilds ? `\nUnavailable guilds: ${arr.join(", ")}` : ""}`);

	}
}
