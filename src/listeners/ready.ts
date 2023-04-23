import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import KaikiSapphireClient from "../lib/Kaiki/KaikiSapphireClient";

@ApplyOptions<ListenerOptions>({
    event: "ready",
    once: true,
})
export default class Ready extends KaikiListener {
    public async run(): Promise<void> {
        (this.container.client as KaikiSapphireClient<true>).initializeServices()
            .then(() => logger.info("DailyResetTimer | Service initiated"));
    }
}
