import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "ready",
    once: true,
})
export default class ReadyListener extends KaikiListener {
    public async run(): Promise<void> {
        this.client.initializeServices()
            .then(() => logger.info("DailyResetTimer | Service initiated"));
    }
}
