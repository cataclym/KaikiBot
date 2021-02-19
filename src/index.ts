"use strict";

import { customClient } from "./struct/client";
import { config } from "./config";
import { logger } from "./nsb/Logger";
import { extensionHook } from "./Extensions/Discord";

extensionHook();

const client = new customClient();

process.on("unhandledRejection", error => logger.high(`unhandledRejection | ${error}`));

client.login(config.token)
	.catch((err: Error) => {
		console.error(err);
	});