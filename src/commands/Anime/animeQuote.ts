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

        const resp = await fetch("http://animechan.melosh.space/random");

        if (!resp.ok) {
            this.container.logger.warn(`Animequote received no data: ${resp.statusText}`);
        }

        const response = <RespType> await resp.json();

        if (!animeQuoteCache.has(response.character)) animeQuoteCache.set(response.character, response);

        return sendQuote(response, message);
    }
}
