import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Shinobu extends KaikiCommand {
    constructor() {
        super("shinobu", {
            aliases: ["shinobu"],
            description: "Spawn a shinobu picture",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(message, "shinobu");
    }
}
