import { extensionHook } from "./Extensions/Discord";
import logger from "loglevel";
import { customClient } from "./struct/client";
import { config } from "./config";
import { exec } from "child_process";

logger.setLevel("INFO", true);
// Shmart
exec("git update-index --assume-unchanged src/config.ts", (err, stdout, stderr) => {
	if (err) logger.high("Untracking changes to config file\n" + err);
	if (stderr) logger.high("Untracking changes to config file\n" + stderr);
	logger.info("Untracking changes to src/config.ts");
});


extensionHook();

process.on("unhandledRejection", error => logger.error(`unhandledRejection | ${(error as Error)?.stack}`));

new customClient()
	.login(config.token)
	.catch((err: Error) => {
		logger.error(err);
	});