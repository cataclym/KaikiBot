import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "spank",
    description: "OwO Being naughty are we?",
    usage: ["", "@dreb"],
    typing: true,
})
export default class SpankCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        return this.client.imageAPIs.NekosLife.sendImageAPIRequest(message, "spank", await args.rest("member").catch(() => null));
    }
}
