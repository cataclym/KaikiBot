import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "warn",
})
export default class Warn extends KaikiListener {

    // Emitted for general warnings.
    public async run(info: string): Promise<void> {

        logger.warn(`warn | ${info}`);
    }
}
