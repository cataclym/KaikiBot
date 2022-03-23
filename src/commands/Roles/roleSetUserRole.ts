import { PrefixSupplier } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { GuildMember, Message, MessageEmbed, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

// Rewrite of Miyano's setuserrole command
// https://github.com/PlatinumFT/Miyano-v2
// Thanks Plat.

export default class SetUserRoleCommand extends KaikiCommand {
    constructor() {
        super("setuserrole", {
            aliases: ["setuserrole", "sur"],
            description: "Assigns a role to a user. Provide the command again to remove the role.",
            usage: "@Platinum [role]",
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            prefix: (msg: Message) => {
                const p = (this.handler.prefix as PrefixSupplier)(msg);
                return [p as string, ";"];
            },
            channel: "guild",
            args: [
                {
                    id: "member",
                    type: "member",
                    otherwise: "Please specify a user to add!",
                },
                {
                    id: "role",
                    type: "role",
                    otherwise: "Please specify a role to add!",
                },
            ],
        });
    }

    public async exec(message: Message<true>, { member, role }: { member: GuildMember, role: Role }): Promise<Message> {

        const embedFail = async (text: string) => new MessageEmbed()
                .setDescription(text)
                .withErrorColor(message),

            embedSuccess = async (text: string) => new MessageEmbed()
                .setDescription(text)
                .withOkColor(message);

        const botRole = message.guild?.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(role);

        if (!isPosition || (isPosition <= 0)) {
            return message.channel.send({ embeds: [await embedFail("This role is higher than me, I cannot add this role!")] });
        }

        else if (message.author.id !== message.guild?.ownerId &&
            (message.member as GuildMember).roles.highest.position < role.position) {

            return message.channel.send({ embeds: [await embedFail("This role is higher than your highest, I cannot add this role!")] });
        }

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

        if (!db) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        if (db?.UserRole) {
            const userRole = message.guild.roles.cache.get(String(db.UserRole));

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

            try {
                await member.roles.remove(userRole || String(db.UserRole) as Snowflake);
            }
            catch (err) {
                throw new Error("Failed to delete user role.\n" + err);
            }

            return message.channel.send({ embeds: [await embedSuccess(`Removed role ${(userRole)?.name ?? String(db.UserRole)} from ${member.user.username}`)] });
        }

        else {
            this.client.orm.guildUsers.update({
                where: {
                    Id_UserId: {
                        Id: db.Id,
                        UserId: db.UserId,
                    },
                },
                data: {
                    UserRole: BigInt(role.id),
                },
            });

            await member.roles.add(role);
            return message.channel.send({ embeds: [await embedSuccess(`Adding role ${role.name} to ${member.user.username}`)] });
        }
    }
}
