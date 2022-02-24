import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class ReloadCommand extends KaikiCommand {
    constructor() {
        super("reload", {
            aliases: ["re", "reload"],
            description: "Reloads a command. Note: It does not run the TypeScript compiler.",
            ownerOnly: true,
            args: [{
                id: "command",
                type: "command",
                otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
            }],
        });
    }
    public async exec(message: Message, { command }: { command: KaikiCommand}): Promise<Message> {

        command.reload();
        return message.channel.send({
            embeds: [new MessageEmbed({
                title: "Command reloaded",
                description: command.filepath,
                footer: { text: "Command: " + command.id },
            })
                .withOkColor(message)],
        });
    }
}
