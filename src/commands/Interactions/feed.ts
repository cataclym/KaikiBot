import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "feed",
    description: "When you need to feed someone...?",
    usage: [""],
    typing: true,
})
export default class Feed extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        return this.client.imageAPIs.PurrBot.sendImageAPIRequest(
            message,
            "feed",
            await args.rest("member").catch(() => null)
        );
    }
}
