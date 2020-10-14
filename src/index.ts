"use strict";

import { customClient } from "./struct/client";
import { config } from "./config";

const client = new customClient();

process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection:", error));
// Thanks D.js guide // Does this even work? xd // Ayy it worked once

client.login(config.token).catch((err: Error) => {
	console.error(err);
});