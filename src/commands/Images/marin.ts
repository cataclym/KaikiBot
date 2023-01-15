import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Marin extends KaikiCommand {
    constructor() {
        super("marin", {
            aliases: ["marin"],
            description: "Returns an image of Marin Kitagawa",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(message, "marin-kitagawa");
    }
}
