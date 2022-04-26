import { Listener } from "discord-akairo";
import logger from "loglevel";

export default class WarnListener extends Listener {
    constructor() {
        super("warn", {
            event: "warn",
            emitter: "client",
        });
    }

    // Emitted for general warnings.

    public async exec(info: string): Promise<void> {

        logger.warn(`warn | ${info}`);
    }
}
