import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { APIs } from "../../lib/APIs/WaifuPics";

@ApplyOptions<KaikiCommandOptions>({
    name: "yeet",
    description: "Yeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet",
    usage: ["", "@dreb"],
    typing: true,
})
export default class Yeet extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(
            message,
            APIs.yeet,
            await args.rest("member").catch(() => null)
        );
    }
}
