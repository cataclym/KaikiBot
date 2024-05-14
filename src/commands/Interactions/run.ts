import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "run",
    description: "Gotta go fast~",
    usage: [""],
    typing: true,
})
export default class RunCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {
        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(
            message,
            "run"
        );
    }
}
