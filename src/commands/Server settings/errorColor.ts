import { Argument } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../../lib/Color";
import { KaikiCommand } from "kaiki";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class ErrorColorConfigCommand extends KaikiCommand {
    constructor() {
        super("config-errorcolor", {
            userPermissions: "ADMINISTRATOR",
            channel: "guild",
            args: [
                {
                    id: "value",
                    type: Argument.union("color", (m: Message, content: string) => hexColorTable[content]),
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
            ],
        });
    }
    public async exec(message: Message, { value }: { value: string | number }): Promise<Message> {
        const guildID = (message.guild as Guild).id;

        if (typeof value === "number") value = value.toString(16);

        await this.client.guildProvider.set(guildID, "ErrorColor", value);

        return message.channel.send({
            embeds: [new MessageEmbed({
                title: "Success!",
                description: `errorColor has been set to \`${value}\` !`,
            })
                .withOkColor(message)],
        });
    }

}
