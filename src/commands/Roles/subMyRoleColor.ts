import { hexColorTable } from "../../lib/Color";
import { ColorResolvable, Guild, Message, MessageEmbed } from "discord.js";
import { Argument } from "discord-akairo";
import { getGuildDocument } from "../../struct/documentMethods";
import { Snowflake } from "discord-api-types";
import KaikiCommand from "Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class MyRoleSubCommandColor extends KaikiCommand {
    constructor() {
        super("myrolecolor", {
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild",
            args: [{
                id: "color",
                type: Argument.union((_, phrase) => hexColorTable[phrase.toLowerCase()], "color"),
                otherwise: (m: Message) => ({ embeds: [new MessageEmbed()
                    .setTitle("Please provide a valid hex-color or color name")
                    .withErrorColor(m)] }),
            }],
        });
    }

    async exec(message: Message<true>, { color }: { color: string | number }): Promise<Message> {

        if (typeof color === "number") color = color.toString(16);

        const db = await this.client.orm.guildUsers.findFirst({
            where: {
                GuildId: BigInt(message.guildId),
                UserId: BigInt(message.author.id),
            },
            select: {
                UserRole: true,
                Id: true,
                UserId: true,
            },
        });

        if (!db || !db.UserRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        const myRole = message.guild.roles.cache.get(String(db.UserRole));

        if (!myRole) {
            this.client.orm.guildUsers.update({
                where: {
                    Id_UserId: {
                        Id: db.Id,
                        UserId: db.UserId,
                    },
                },
                data: {
                    UserRole: null,
                },
            });
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });
        }

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
