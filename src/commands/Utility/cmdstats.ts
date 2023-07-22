import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { Args, Awaitable } from "@sapphire/framework";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";

@ApplyOptions<KaikiCommandOptions>({
    name: "cmdstats",
    description: "Displays command statistics. Stats are updated at interval.",
})
export default class Cmdstats extends KaikiCommand {
    async messageRun(message: Message, args: Args) {
        const db = await this.client.orm.commandStats.findMany();

        const totalRan = db.map(entry => entry.Count)
            .reduce((a, b) => a + b);
    }
}