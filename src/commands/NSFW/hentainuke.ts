import { EmbedBuilder, Message } from "discord.js";
import HentaiService, { HentaiTypes } from "../../lib/Hentai/HentaiService";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class HentaiBombCommand extends KaikiCommand {
    constructor() {
        super("hentainuke", {
            aliases: ["hentainuke", "hn"],
            description: "Posts 30 NSFW images, using the waifu.pics API",
            usage: HentaiService.hentaiArray,
            args: [
                {
                    id: "category",
                    type: HentaiService.hentaiArray,
                    default: null,
                },
            ],
        });
    }

    public async exec(message: Message, { category }: { category: HentaiTypes | null }): Promise<void> {

        const megaResponse = (await this.client.hentaiService.grabHentai(category ?? HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "bomb"));

        for (let index = 10, p = 0; p < megaResponse.length; index += 10, p += 10) {
            await message.channel.send({
                embeds: megaResponse.slice(p, index).map(link => new EmbedBuilder()
                    .setImage(link)
                    .withOkColor(message)),
            });
        }
    }
}
