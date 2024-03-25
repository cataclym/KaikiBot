import { container } from "@sapphire/pieces";
// eslint-disable-next-line import/no-unresolved
import "@sapphire/plugin-logger/register";
import "./extensions/Discord";
import "./extensions/Sapphire";
import KaikiSapphireClient from "./lib/Kaiki/KaikiSapphireClient";
import BotContainer from "./struct/BotContainer";
import { config } from "dotenv";

config();

process.on("unhandledRejection", async (reason: Error, promise) =>
    container.logger.warn(reason, promise)
);

const bot = new BotContainer(new KaikiSapphireClient());
void bot.init();
