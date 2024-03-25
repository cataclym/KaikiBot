import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "girl",
    description: "Spawn art of a girl",
    usage: [""],
    typing: true,
    cooldownDelay: 1000,
})
export default class Girl extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        return this.client.imageAPIs.NekosAPI.sendImageAPIRequest(
            message,
            "Girl"
        );
    }
}
