import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import * as colorette from "colorette";

@ApplyOptions<ListenerOptions>({
    event: Events.ShardReconnecting,
})
export default class ShardReconnecting extends Listener {
    // Emitted when a shard is attempting to reconnect or re-identify.
    public async run(id: number): Promise<void> {
        this.container.logger.info(
            `shardReconnecting | Shard: ${colorette.green(id)}`
        );
    }
}
