import { PrefixSupplier } from "discord-akairo";
import { EmbedBuilder, Guild, Message, PermissionsBitField } from "discord.js";

import GreetHandler, { JSONToMessageOptions } from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class ByeMessageCommand extends KaikiCommand {
    constructor() {
        super("goodbyemessage", {
            aliases: ["goodbyemessage", "goodbyemsg", "byemsg"],
            userPermissions: PermissionsBitField.Flags.ManageGuild,
            description: "Set message to display when someone leaves the guild. Provide either text, or valid JSON from the [embed creator](https://embed.kaikibot.xyz)",
            channel: "guild",
            args: [
                {
                    id: "msg",
                    type: (message, phrase) => {
                        try {
                            return JSON.parse(message.content.substring(message.content.indexOf(phrase)));
                        }
                        catch {
                            return undefined;
                        }
                    },
                    otherwise: (m) => GreetHandler.jsonErrorMessage(m),
                },
            ],
            subCategory: "Goodbye",
        });
    }

    public async exec(message: Message, { msg }: { msg: JSONToMessageOptions }): Promise<Message> {

        const json = new JSONToMessageOptions(msg);
        if (!json) return message.channel.send(GreetHandler.jsonErrorMessage(message));

        const guildID = (message.guild as Guild).id;

        const db = await this.client.orm.guilds.update({
            where: { Id: BigInt(guildID) },
            data: { ByeMessage: JSON.stringify(json) },
        });

        const prefix = (this.handler.prefix as PrefixSupplier)(message);
        const embed = [
            new EmbedBuilder()
                .setDescription(`New bye message has been set!\n\nTest what the message looks like by typing \`${prefix}byetest\``)
                .withOkColor(message),
        ];

        if (!db.ByeChannel) {
            embed.push(new EmbedBuilder()
                .setDescription(`Enable \`goodbye\` messages by typing \`${prefix}goodbye\`.`)
                .withOkColor(message),
            );
        }

        return message.channel.send({
            embeds: embed,
        });
    }
}
