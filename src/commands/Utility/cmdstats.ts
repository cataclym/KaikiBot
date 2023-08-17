import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "cmdstats",
    description: "Displays command statistics. Stats are updated at interval.",
    enabled: false,
})
export default class Cmdstats extends KaikiCommand {
    async messageRun(message: Message, args: Args) {
        const db = await this.client.orm.commandStats.findMany();

        const totalRan = db.map(entry => entry.Count)
            .reduce((a, b) => a + b);
    }
}
