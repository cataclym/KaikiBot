import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Ero extends KaikiCommand {
    constructor() {
        super("ero", {
            aliases: ["ero"],
            description: "Returns a nsfw ero picture",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(message, "ero", undefined, true);
    }
}
