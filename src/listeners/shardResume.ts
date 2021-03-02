import { Listener } from "@cataclym/discord-akairo";
import logger from "loglevel";


export default class ShardResumeListener extends Listener {
	constructor() {
		super("shardResume", {
			event: "shardResume",
			emitter: "client",
		});
	}
	// Emitted when a shard resumes successfully.

	public async exec(id: number, replayedEvents: number): Promise<void> {

		logger.info(`shardResume | Shard: ${id} \nReplayed ${replayedEvents} events.`);

	}
}
