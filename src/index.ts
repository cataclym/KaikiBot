import { container } from "@sapphire/pieces";
import "@sapphire/plugin-logger/register";
import "./extensions/Discord";
import "./extensions/Sapphire";
import KaikiAkairoClient from "./lib/Kaiki/KaikiAkairoClient";
import BotContainer from "./struct/BotContainer";

class KaikiProgram {
    async init() {
        process.on("unhandledRejection", async (reason: Error, promise) => container.logger.warn("Unhandled Rejection at:", promise));

        const bot = new BotContainer(new KaikiAkairoClient());
        await bot.init();
    }
}

void new KaikiProgram().init();
