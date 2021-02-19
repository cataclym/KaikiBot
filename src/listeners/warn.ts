import { Listener } from "@cataclym/discord-akairo";
import { logger } from "../nsb/Logger";

export default class WarnListener extends Listener {
	constructor() {
		super("warn", {
			event: "warn",
			emitter: "client",
		});
	}
	// Emitted for general warnings.

	public async exec(info: string): Promise<void> {

		logger.medium(`warn | ${info}`);

	}
}
