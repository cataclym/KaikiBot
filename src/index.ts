import { exec } from "child_process";
import logger from "loglevel";
import { config } from "./config";
import { extensionHook } from "./Extensions/Discord";
import { customClient } from "./struct/client";

logger.setLevel("INFO");
// Shmart
exec("git update-index --assume-unchanged src/config.ts", (err, stdout, stderr) => {
	if (err) logger.error("Untracking changes to config file\n" + err);
	if (stderr) logger.error("Untracking changes to config file\n" + stderr);
	logger.info("Untracking changes to src/config.ts");
});


extensionHook();

process.on("unhandledRejection", error => logger.error(`unhandledRejection | ${(error as Error)?.stack}`));

new customClient()
	.login(config.token)
	.catch((err: Error) => {
		logger.error(err);
	});