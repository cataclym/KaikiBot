import logger from "loglevel";
import { config } from "./config";
import { extensionHook } from "./Extensions/Discord";
import { customClient } from "./struct/client";

logger.setLevel("INFO", true);

extensionHook();

process.on("unhandledRejection", error => logger.error(`unhandledRejection | ${(error as Error)?.stack}`));

new customClient()
	.login(config.token)
	.catch((err: Error) => {
		logger.error(err);
	});