import logger from "loglevel";
import { extensionHook } from "./extensions/Discord";
import KaikiAkairoClient from "./lib/Kaiki/KaikiAkairoClient";
import BotContainer from "./struct/BotContainer";
import { startLogger } from "./struct/logging";

class KaikiProgram {
    async init() {
        extensionHook();
        await startLogger();
        process.on("unhandledRejection", async (reason: Error, promise) => logger.warn("Unhandled Rejection at:", promise));

        const bot = new BotContainer(new KaikiAkairoClient());
        await bot.init();
    }
}

void new KaikiProgram().init();
