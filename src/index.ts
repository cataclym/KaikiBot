import { container } from "@sapphire/pieces";
import "@sapphire/plugin-logger/register";
import "./extensions/Discord";
import "./extensions/Sapphire";
import KaikiSapphireClient from "./lib/Kaiki/KaikiSapphireClient";
import BotContainer from "./struct/BotContainer";

class KaikiProgram {
    async init() {
        process.on("unhandledRejection", async (reason: Error, promise) => container.logger.warn(reason, promise));

        const bot = new BotContainer(new KaikiSapphireClient());
        await bot.init();
    }
}

void new KaikiProgram().init();
