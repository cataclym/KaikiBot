import { Argument } from "discord-akairo";
import { ColorResolvable, EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import { hexColorTable } from "../../lib/Color";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles from "../../lib/Roles";

export default class MyRoleSubCommandColor extends KaikiCommand {
    constructor() {
        super("myrolecolor", {
            clientPermissions: PermissionsBitField.Flags.ManageRoles,
            channel: "guild",
            args: [
                {
                    id: "color",
                    type: Argument.union((_, phrase) => {
                        phrase = phrase.toLowerCase();
                        if (!KaikiUtil.hasKey(hexColorTable, phrase)) return;
                        return hexColorTable[phrase];
                    }, "color"),
                    otherwise: (m: Message) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Please provide a valid hex-color or color name")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    async exec(message: Message<true>, { color }: { color: string | number }): Promise<Message> {

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        if (Number.isInteger(color)) color = color.toString(16);

        const botRole = message.guild?.members.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        const oldHex = myRole.hexColor;
        await myRole.setColor(color as ColorResolvable);
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You have changed \`${myRole.name}\`'s color from \`${oldHex}\` to \`${color}\`!`)
                    .setColor(color as ColorResolvable),
            ],
        });
    }
}
