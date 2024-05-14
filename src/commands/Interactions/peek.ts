import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "peek",
    description: "Peek around the corner",
    usage: [""],
    typing: true,
})
export default class Peek extends KaikiCommand {
    public async messageRun(message: Message) {
        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(
            message,
            "peek"
        );
    }
}
