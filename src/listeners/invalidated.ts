import { Listener } from "@cataclym/discord-akairo";
import { logger } from "../nsb/Logger";

export default class InvalidatedListener extends Listener {
	constructor() {
		super("invalidated", {
			event: "invalidated",
			emitter: "client",
		});
	}
	// Emitted when the client's session becomes invalidated.

	public async exec(): Promise<never> {

		logger.high("invalidated | Session has become invalidated. Shutting down client.");

		return process.exit(1);

	}
}
