import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "ready",
    once: true,
})
export default class Ready extends KaikiListener {
    public async run(): Promise<void> {
        this.container.client.initializeServices()
            .then(() => this.container.logger.info("DailyResetTimer | Service initiated"));
    }
}
