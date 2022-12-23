import { EmbedBuilder, Message, PermissionsBitField, resolveColor } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { KaikiColor } from "../../lib/Types/KaikiColor";

export default class ErrorColorConfigCommand extends KaikiCommand {
    constructor() {
        super("config-errorcolor", {
            userPermissions: PermissionsBitField.Flags.Administrator,
            channel: "guild",
            args: [
                {
                    id: "value",
                    type: "kaiki_color",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { value }: { value: KaikiColor }): Promise<Message> {
        const guildID = message.guild.id;

        const intValue = resolveColor([value.r, value.g, value.b]);

        await this.client.guildsDb.set(guildID, "ErrorColor", intValue);

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: "Success!",
                    description: `errorColor has been set to \`${intValue}\` !`,
                })
                    .withOkColor(message),
            ],
        });
    }

}
