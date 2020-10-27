"use strict";

import { customClient } from "./struct/client";
import { config } from "./config";

const client = new customClient();

process.on("unhandledRejection", error => console.error("unhandledRejection | ", error));

client.login(config.token).catch((err: Error) => {
	console.error(err);
});