import logger from "loglevel";
import { extensionHook } from "./Extensions/Discord";
import container from "./inversify.config";
import { Bot } from "./struct/bot";
import { TYPES } from "./struct/types";
import { startLogger } from "./struct/logging";

extensionHook();
(async () => await startLogger())();

process.on("unhandledRejection", (reason: Error, promise) => {
	logger.warn("Unhandled Rejection at:", promise, "reason:", reason);
});

const bot = container.get<Bot>(TYPES.Bot);

bot.start().catch(e => logger.error(e));
