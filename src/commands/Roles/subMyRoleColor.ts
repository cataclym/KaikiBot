import { Argument } from "discord-akairo";
import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../../lib/Color";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles from "../../lib/roles";

export default class MyRoleSubCommandColor extends KaikiCommand {
    constructor() {
        super("myrolecolor", {
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild",
            args: [{
                id: "color",
                type: Argument.union((_, phrase) => hexColorTable[phrase.toLowerCase()], "color"),
                otherwise: (m: Message) => ({
                    embeds: [new MessageEmbed()
                        .setTitle("Please provide a valid hex-color or color name")
                        .withErrorColor(m)],
                }),
            }],
        });
    }

    async exec(message: Message<true>, { color }: { color: string | number }): Promise<Message> {

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        if (typeof color === "number") color = color.toString(16);

        const botRole = message.guild?.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        const oldHex = myRole.hexColor;
        await myRole.setColor(color as ColorResolvable);
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`You have changed \`${myRole.name}\`'s color from \`${oldHex}\` to \`${color}\`!`)
                .setColor(color as ColorResolvable)],
        });
    }
}
