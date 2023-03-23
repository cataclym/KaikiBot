import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "ero",
    description: "Returns a nsfw ero picture",
    usage: [""],
    typing: true,
})
export default class Ero extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(message, "ero", undefined, true);
    }
}
