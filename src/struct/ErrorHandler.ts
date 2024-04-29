import { container } from "@sapphire/framework";
import process from "process";

process.on("unhandledRejection", async (reason: Error, promise) =>
    container.logger.warn(reason, promise)
);

process.on("uncaughtException", async (reason: Error, promise) =>
    container.logger.warn(reason, promise)
);
