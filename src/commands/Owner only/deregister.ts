import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "deregister",
    aliases: ["dereg"],
    usage: "todo",
    description: "Deregister a command, until bot restarts.",
    preconditions: ["OwnerOnly"],
})
export default class Deregister extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const cmd = await args.rest("command");

        const unloaded = await this.store.unload(cmd);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Command has been deregistered.")
                    .setDescription(`\`${unloaded.name}\` is now disabled.`)
                    .withOkColor(message),
            ],
        });
    }
}
