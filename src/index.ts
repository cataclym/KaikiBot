"use strict";

import { config } from "./config";
import { extensionHook } from "./Extensions/Discord";
import { logger } from "./nsb/Logger";
import { customClient } from "./struct/client";

extensionHook();

const client = new customClient();

process.on("unhandledRejection", error => logger.high(`unhandledRejection | ${(error as Error)?.stack}`));

client.login(config.token)
	.catch((err: Error) => {
		console.error(err);
	});