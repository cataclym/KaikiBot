import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";

@ApplyOptions<ListenerOptions>({
    event: Events.ShardDisconnect,
})
export default class ShardDisconnect extends Listener {

    // Emitted when a shard's WebSocket disconnects and will no longer reconnect.
    public async run(event: CloseEvent, id: number) {

        this.container.logger.warn(`ShardDisconnect | Shard: ${chalk.redBright(id)} Reason: ${event.reason}`);
    }
}
