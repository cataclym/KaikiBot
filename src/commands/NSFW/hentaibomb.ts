import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { grabHentai, types, typesArray } from "./hentaiService";


export default class HentaiBombCommand extends KaikiCommand {
    constructor() {
        super("hentaibomb", {
            aliases: ["hentaibomb", "hb"],
            description: "Posts 5 NSFW images, using the waifu.pics API",
            usage: typesArray,
            args: [
                {
                    id: "category",
                    type: typesArray,
                    default: null,
                },
            ],
        });
    }

    public async exec(message: Message, { category }: { category: types | null }): Promise<Message | Message[]> {

        const megaResponse = (await grabHentai(category ?? typesArray[Math.floor(Math.random() * typesArray.length)], "bomb")).splice(0, 5);

        return message.channel.send({ content: megaResponse.join("\n") });
    }
}
