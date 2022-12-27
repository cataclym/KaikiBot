import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class Waifu extends KaikiCommand {
    constructor() {
        super("waifu", {
            aliases: ["waifu"],
            description: "Spawn a waifu picture",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(message, "waifu");
    }
}
