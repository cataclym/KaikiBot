"use strict";

import { customClient } from "./struct/client";
import { token } from "./config";

const client = new customClient();
process.on("disconnect", () => console.error("🟧 Process is in disconnected state."));
process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection:", error));
// Thanks D.js guide // Does this even work? xd // Ayy it worked once

client.login(token).catch(err => {
	console.log(err);
});