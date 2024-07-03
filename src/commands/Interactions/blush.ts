import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { EndpointSignatures } from "../../lib/APIs/PurrBot";

@ApplyOptions<KaikiCommandOptions>({
    name: "blush",
    description: "O//////O",
    usage: [""],
    typing: true,
})
export default class Blush extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        return this.client.imageAPIs.PurrBot.sendImageAPIRequest(
            message,
            EndpointSignatures.blush
        );
    }
}
