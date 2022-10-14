import { Argument } from "discord-akairo";
import { Message, EmbedBuilder } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class ReloadCommand extends KaikiCommand {
    constructor() {
        super("reload", {
            aliases: ["re", "reload"],
            description: "Reloads a command..",
            ownerOnly: true,
            args: [{
                id: "command",
                type: Argument.union("command", (m, p) => {
                    if (!p) return null;
                    const alias = this.handler.aliases.get(p);
                    if (!alias) return null;
                    return this.handler.findCommand(alias);
                }),
                otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
            }],
        });
    }

    public async exec(message: Message, { command }: { command: KaikiCommand }): Promise<Message> {

        command.reload();
        return message.channel.send({
            embeds: [new EmbedBuilder({
                title: "Command reloaded",
                description: command.filepath,
                footer: { text: `Command: ${command.id}` },
            })
                .withOkColor(message)],
        });
    }
}
