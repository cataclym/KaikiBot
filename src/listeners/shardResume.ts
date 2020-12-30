import { Listener } from "@cataclym/discord-akairo";

export default class ShardResumeListener extends Listener {
	constructor() {
		super("shardResume", {
			event: "shardResume",
			emitter: "client",
		});
	}
	// Emitted when a shard resumes successfully.

	public async exec(id: number, replayedEvents: number): Promise<void> {

		console.log(`🟩 shardResume | Shard: ${id} \nReplayed ${replayedEvents} events.`);

	}
}
