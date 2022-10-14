import { Guild, Message, EmbedBuilder } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class PrefixConfigCommand extends KaikiCommand {
    constructor() {
        super("config-prefix", {
            userPermissions: ["ADMINISTRATOR"],
            channel: "guild",
            args: [{
                id: "value",
                type: "string",
                otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
            }],
        });
    }

    public async exec(message: Message, { value }: { value: string }): Promise<Message | void> {

        const guildID = (message.guild as Guild).id,
            oldPrefix = message.client.guildsDb.get(guildID, "Prefix", process.env.PREFIX);

        await message.client.guildsDb.set(guildID, "Prefix", value);

        return message.channel.send({
            embeds: [new EmbedBuilder({
                title: "Prefix changed!",
                description: `Prefix has been set to \`${value}\` !`,
                footer: { text: `Old prefix: \`${oldPrefix}\`` },
            })
                .withOkColor(message)],
        });
    }
}
