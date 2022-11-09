import { Listener } from "discord-akairo";
import logger from "loglevel";

export default class InvalidatedListener extends Listener {
    constructor() {
        super("invalidated", {
            event: "invalidated",
            emitter: "client",
        });
    }

    // Emitted when the client's session becomes invalidated.

    public async exec(): Promise<never> {

        logger.error("invalidated | Session has become invalidated. Shutting down client.");

        return process.exit(1);

    }
}
