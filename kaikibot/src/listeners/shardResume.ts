import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import * as colorette from "colorette";
import type KaikiSapphireClient from "../lib/Kaiki/KaikiSapphireClient";

@ApplyOptions<ListenerOptions>({
    event: Events.ShardResume,
})
export default class ShardResume extends Listener {

    // Emitted when a shard resumes successfully.
    public async run(id: number, replayedEvents: number): Promise<void> {

        this.container.logger.info(`shardResume | Shard: ${colorette.green(id)} \nReplayed ${colorette.green(replayedEvents)} events.`);

        await (this.container.client as KaikiSapphireClient<true>).setPresence();
    }
}
