import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class RunCommand extends KaikiCommand {
    constructor() {
        super("run", {
            aliases: ["run"],
            description: "Gotta go fast~",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(message, "run");
    }
}
