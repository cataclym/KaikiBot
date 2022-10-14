import { PrefixSupplier } from "discord-akairo";
import { GuildMember, Message, EmbedBuilder, Role } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

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

    embedFail = async (message: Message<boolean>, text: string) => new EmbedBuilder()
        .setDescription(text)
        .withErrorColor(message);

    embedSuccess = async (message: Message<boolean>, text: string) => new EmbedBuilder()
        .setDescription(text)
        .withOkColor(message);

    public async exec(message: Message<true>, { member, role }: { member: GuildMember, role: Role }): Promise<Message> {

        const botRole = message.guild?.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(role);

        if (!isPosition || (isPosition <= 0)) {
            return message.channel.send({ embeds: [await this.embedFail(message, "This role is higher than me, I cannot add this role!")] });
        }

        else if (message.author.id !== message.guild?.ownerId &&
            (message.member as GuildMember).roles.highest.position < role.position) {

            return message.channel.send({ embeds: [await this.embedFail(message, "This role is higher than your highest, I cannot add this role!")] });
        }

        const db = await this.client.db.getOrCreateGuildUser(BigInt(member.id), BigInt(message.guildId));

        if (db.UserRole) {

            await this.client.orm.guildUsers.update({
                where: {
                    UserId_GuildId: {
                        UserId: BigInt(message.author.id),
                        GuildId: BigInt(message.guildId),
                    },
                },
                data: {
                    UserRole: null,
                },
            });

            const userRole = message.guild.roles.cache.get(String(db.UserRole));

            try {
                await member.roles.remove(userRole || String(db.UserRole));
            }
            catch (err) {
                throw new Error("Failed to remove user role.\n" + err);
            }

            return message.channel.send({ embeds: [await this.embedSuccess(message, `Removed role ${userRole?.name ?? String(db.UserRole)} from ${member.user.username}`)] });
        }

        else {
            await this.client.orm.guildUsers.update({
                where: {
                    UserId_GuildId: {
                        UserId: BigInt(member.id),
                        GuildId: BigInt(message.guildId),
                    },
                },
                data: {
                    UserRole: BigInt(role.id),
                },
            });

            await member.roles.add(role);
            return message.channel.send({ embeds: [await this.embedSuccess(message, `Adding role ${role.name} to ${member.user.username}`)] });
        }
    }
}
