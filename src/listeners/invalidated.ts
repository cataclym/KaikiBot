import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
    event: "invalidated",
})
export default class InvalidatedListener extends Listener {

    // Emitted when the client's session becomes invalidated.
    public async run(): Promise<never> {

        this.container.logger.error("invalidated | Session has become invalidated. Shutting down client.");

        return process.exit(1);

    }
}
