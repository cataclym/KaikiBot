import { Message } from "discord.js";
import HentaiService, { HentaiTypes } from "../../lib/Hentai/HentaiService";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class HentaiBombCommand extends KaikiCommand {
    constructor() {
        super("hentaibomb", {
            aliases: ["hentaibomb", "hb"],
            description: "Posts 5 NSFW images, using the waifu.pics API",
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

    public async exec(message: Message, { category }: { category: HentaiTypes | null }): Promise<Message | Message[]> {

        const megaResponse = (await this.client.hentaiService.grabHentai(category ?? HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "bomb"))
            .splice(0, 5);

        return message.channel.send({ content: megaResponse.join("\n") });
    }
}
