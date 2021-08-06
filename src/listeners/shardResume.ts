import { Listener } from "discord-akairo";
import logger from "loglevel";
import { getBotDocument } from "../struct/documentMethods";


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

		const botDb = await getBotDocument();
		this.client.user?.setPresence({
			activities: [{
				name: botDb.settings.activity,
				type: botDb.settings.activityType,
			}],
		});
	}
}
