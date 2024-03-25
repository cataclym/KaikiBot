import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class HugCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(
            message,
            "hug",
            await args.rest("member").catch(() => null)
        );
    }
}
