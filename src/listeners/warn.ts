import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import logger from "loglevel";

@ApplyOptions<ListenerOptions>({
    event: "warn",
})
export default class Warn extends Listener {

    // Emitted for general warnings.
    public async run(info: string): Promise<void> {

        logger.warn(`warn | ${info}`);
    }
}
