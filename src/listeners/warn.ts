import { Listener } from "discord-akairo";

export default class WarnListener extends Listener {
	constructor() {
		super("warn", {
			event: "warn",
			emitter: "client",
		});
	}
	// Emitted for general warnings.

	public async exec(info: string): Promise<void> {

		console.warn(`🟧 ${info}`);

	}
}
