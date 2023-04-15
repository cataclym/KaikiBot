import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "invalidated",
})
export default class InvalidatedListener extends KaikiListener {

    // Emitted when the client's session becomes invalidated.
    public async run(): Promise<never> {

        logger.error("invalidated | Session has become invalidated. Shutting down client.");

        return process.exit(1);

    }
}
