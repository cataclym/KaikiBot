import logger from "loglevel";
import { extensionHook } from "./Extensions/Discord";
import { customClient } from "./struct/client";

logger.setLevel("INFO");

extensionHook();

process.on("unhandledRejection", (reason: Error, promise) => {
	logger.warn("Unhandled Rejection at:", promise, "reason:", reason);
});

const client = new customClient();

if (!process.env.PREFIX) {
	throw new Error("Missing prefix! Set a prefix in .env");
}

if (!process.env.OWNER) {
	throw new Error("Missing owner-ID! Please double-check the guide and set an owner in .env");
}

client.login(process.env.CLIENT_TOKEN)
	.catch((err: Error) => {
		return logger.error(err);
	});
