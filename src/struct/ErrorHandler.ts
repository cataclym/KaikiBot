import { container } from "@sapphire/framework";
import process from "process";

process.on("unhandledRejection", (reason: Error, promise) =>
    console.warn(reason, promise)
);

process.on("uncaughtException", (reason: Error, promise) =>
    console.warn(reason, promise)
);
