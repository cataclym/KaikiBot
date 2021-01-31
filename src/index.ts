import { customClient } from "./struct/client";
import { config } from "./config";
import { logger } from "./nsb/Logger";
import { exec } from "child_process";

// Shmart
exec("git update-index --assume-unchanged src/config.ts", (err, stdout, stderr) => {
	if (err) logger.high("Untracking changes to config file\n" + err);
	if (stderr) logger.high("Untracking changes to config file\n" + stderr);
	logger.info("Untracking changes to src/config.ts");
});

const client = new customClient();

process.on("unhandledRejection", error => console.error("unhandledRejection | ", error));

client.login(config.token).catch((err: Error) => {
	logger.high(err);
});