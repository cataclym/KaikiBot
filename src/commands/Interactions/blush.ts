import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Blush extends KaikiCommand {
    constructor() {
        super("blush", {
            aliases: ["blush"],
            description: "O//////O",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.PurrBot.sendImageAPIRequest(message, "blush");
    }
}
