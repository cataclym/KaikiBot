import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { EndpointSignatures } from "../../lib/APIs/PurrBot";

@ApplyOptions<KaikiCommandOptions>({
    name: "bite",
    description: "Bite someone >:)",
    usage: [""],
    typing: true,
})
export default class Bite extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        return this.client.imageAPIs.PurrBot.sendImageAPIRequest(
            message,
            EndpointSignatures.bite,
            await args.rest("member").catch(() => null)
        );
    }
}
