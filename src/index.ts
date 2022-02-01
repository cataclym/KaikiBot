import logger from "loglevel";
import { extensionHook } from "./extensions/Discord";
import { startLogger } from "./struct/logging";
import "reflect-metadata";
import { Bot } from "./struct/bot";
import KaikiAkairoClient from "./struct/KaikiAkairoClient";

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
