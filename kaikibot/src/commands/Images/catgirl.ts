import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "catgirl",
    description: "Spawn a catgirl picture",
    usage: [""],
    typing: true,
    cooldownDelay: 1000,
})
export default class Catgirl extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        return this.client.imageAPIs.NekosAPI.sendImageAPIRequest(message, "Catgirl");
    }
}
