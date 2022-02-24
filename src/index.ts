import KaikiAkairoClient from "Kaiki/KaikiAkairoClient";
import logger from "loglevel";
import { extensionHook } from "./extensions/Discord";
import { Bot } from "./struct/bot";
import { startLogger } from "./struct/logging";

class KaikiProgram {
    async init() {
        extensionHook();
        await startLogger();
        process.on("unhandledRejection", async (reason: Error, promise) => {
            logger.warn("Unhandled Rejection at:", promise);
        });

        new Bot(new KaikiAkairoClient());
    }
}

void new KaikiProgram().init();
