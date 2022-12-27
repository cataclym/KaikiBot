import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class Neko extends KaikiCommand {
    constructor() {
        super("neko", {
            aliases: ["neko"],
            description: "Spawn a neko picture",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(message, "neko");
    }
}
