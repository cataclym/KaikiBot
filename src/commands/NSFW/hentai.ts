import { Message } from "discord.js";
import HentaiService, { HentaiTypes } from "../../lib/Hentai/HentaiService";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class HentaiCommand extends KaikiCommand {
    constructor() {
        super("hentai", {
            aliases: ["hentai"],
            description: "Fetches hentai images from Booru boards",
            typing: true,
            args: [
                {
                    id: "category",
                    type: HentaiService.hentaiArray,
                    default: null,
                },
            ],
        });
    }

    public async exec(message: Message, { category }: { category: HentaiTypes }): Promise<void | Message> {

        return message.channel.send(await this.client.hentaiService.grabHentai(category || HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "single"));
    }
}
