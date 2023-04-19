import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import logger from "loglevel";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "ready",
    once: true,
})
export default class Ready extends KaikiListener {
    public async run(): Promise<void> {
        (this.container.client as KaikiAkairoClient<true>).initializeServices()
            .then(() => logger.info("DailyResetTimer | Service initiated"));
    }
}
