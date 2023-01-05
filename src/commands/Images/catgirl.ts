import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Catgirl extends KaikiCommand {
    constructor() {
        super("catgirl", {
            aliases: ["catgirl"],
            description: "Spawn a shinobu picture",
            usage: [""],
            cooldown: 1000,
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.NekosAPI.sendImageAPIRequest(message, "catgirl");
    }
}
