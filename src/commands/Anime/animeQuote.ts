import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import fetch from "node-fetch";
import { sendQuote } from "../../lib/APIs/animeQuote";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { RespType } from "../../lib/Types/Miscellaneous";

@ApplyOptions<KaikiCommandOptions>({
    name: "animequote",
    aliases: ["aq"],
    description: "Shows a random anime quote...",
    typing: true,
})
export default class AnimeQuoteCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {

        const { animeQuoteCache } = this.client.cache;

        const resp = <RespType> await fetch("https://animechan.vercel.app/api/random")
            .then(response => response.json())
            .catch((reason) => {
                this.container.logger.warn(`Animequote received no data: ${reason}\n`);

                const random = animeQuoteCache.random();
                if (random) {
                    return sendQuote(random, message);
                }
            });

        if (!animeQuoteCache.has(resp.character)) animeQuoteCache.set(resp.character, resp);

        return sendQuote(resp, message);
    }
}
