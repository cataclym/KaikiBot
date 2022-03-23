import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class MyRoleSubCommandName extends KaikiCommand {
    constructor() {
        super("myrolename", {
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild",
            args: [{
                id: "name",
                match: "rest",
                otherwise: (m: Message) => ({
                    embeds: [new MessageEmbed()
                        .setTitle("Please provide a name")
                        .withErrorColor(m)],
                }),
            }],
        });
    }

    async exec(message: Message<true>, { name }: { name: string }): Promise<Message> {

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

        const oldName = myRole.name;
        await myRole.setName(Utility.trim(name, 32));
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`You have changed \`${oldName}\`'s name to \`${name}\`!`)
                .setColor(myRole.color)],
        });
    }
}
