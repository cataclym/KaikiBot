import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { EndPointSignatures } from "../../lib/APIs/waifu.im";

@ApplyOptions<KaikiCommandOptions>({
    name: "ero",
    description: "Returns a nsfw ero picture",
    usage: [""],
    typing: true,
    nsfw: true,
})
export default class Ero extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(
            message,
            EndPointSignatures.ero,
            undefined,
            true
        );
    }
}
