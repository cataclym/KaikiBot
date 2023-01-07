import { Argument } from "discord-akairo";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class Deregister extends KaikiCommand {
    constructor() {
        super("deregister", {
            aliases: ["deregister", "dereg"],
            description: "Deregister a command, until bot restarts.",
            ownerOnly: true,
            args: [
                {
                    index: 0,
                    id: "command",
                    type: Argument.union("command", "commandAlias"),
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message, { command }: { command: KaikiCommand }) {

        await this.handler.deregister(command);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Command has been deregistered.")
                    .setDescription(`\`${command.id}\` is now fully disabled.`)
                    .withOkColor(message),
            ],
        });
    }
}
