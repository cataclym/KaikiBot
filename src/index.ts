import logger from "loglevel";
import { extensionHook } from "./extensions/Discord";
import container from "./inversify.config";
import { Bot } from "./struct/bot";
import { TYPES } from "./struct/types";
import { startLogger } from "./struct/logging";

extensionHook();
(async () => await startLogger())();

process.on("unhandledRejection", (reason: Error, promise) => {
    logger.warn("Unhandled Rejection at:", promise);
});

export const { connection } = container.get<Bot>(TYPES.Bot).client;
