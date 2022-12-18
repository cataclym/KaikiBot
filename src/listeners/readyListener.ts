import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class ReadyListener extends KaikiListener {
    constructor() {
        super("ready", {
            event: "ready",
            emitter: "client",
            type: "once",
        });
    }

    public async exec(): Promise<void> {

        this.client.initializeServices()
            .then(() => logger.info("DailyResetTimer | Service initiated"));
    }
}
