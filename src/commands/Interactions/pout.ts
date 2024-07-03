import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { EndPointSignatures } from "../../lib/APIs/KawaiiAPI";

@ApplyOptions<KaikiCommandOptions>({
    name: "pout",
    description: "I am not angry, b-baka",
    usage: [""],
    typing: true,
})
export default class Pout extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {
        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(
            message,
            EndPointSignatures.pout
        );
    }
}
