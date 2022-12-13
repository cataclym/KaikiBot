import { Message } from "discord.js";
import HentaiService, { hentaiTypes } from "../../lib/Hentai/HentaiService";
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

    public async exec(message: Message, { category }: { category: hentaiTypes }): Promise<void | Message> {

        return message.channel.send(await this.client.HentaiService.grabHentai(category || HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "single"));
    }
}
