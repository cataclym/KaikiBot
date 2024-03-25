import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "cuddle",
    description: "Cuddle someone!",
    usage: ["", "@dreb"],
    typing: true,
})
export default class Cuddle extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(
            message,
            "cuddle",
            await args.rest("member").catch(() => null)
        );
    }
}
