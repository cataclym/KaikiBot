import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "reload",
    aliases: ["re"],
    description: "Reloads a command..",
    preconditions: ["OwnerOnly"],
})
export default class ReloadCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {

        const cmd = await args.rest("command");

        const unloaded = <KaikiCommand> await this.store.get(cmd.name);

        await unloaded.reload();

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: "Command reloaded",
                    description: unloaded.location.full,
                    footer: { text: `Command: ${unloaded.name}` },
                })
                    .withOkColor(message),
            ],
        });
    }
}
