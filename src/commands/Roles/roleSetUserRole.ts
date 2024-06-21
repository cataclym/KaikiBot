import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, GuildMember, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

// Rewrite of Miyano's setuserrole command
// https://github.com/PlatinumFT/Miyano-v2
// Thanks Plat.

@ApplyOptions<KaikiCommandOptions>({
    name: "setuserrole",
    aliases: ["sur"],
    description:
		"Assigns a role to a user. Provide the command again to remove the role.",
    usage: ["@Platinum [role]"],
    requiredUserPermissions: ["ManageRoles"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
})
export default class SetUserRoleCommand extends KaikiCommand {
    private embedFail = async (message: Message<boolean>, text: string) =>
        new EmbedBuilder().setDescription(text).withErrorColor(message);

    private embedSuccess = async (message: Message<boolean>, text: string) =>
        new EmbedBuilder().setDescription(text).withOkColor(message);

    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        const member = await args.pick("member");
        const role = await args.rest("role");

        const botRole = message.guild?.members.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(role);

        if (!isPosition || isPosition <= 0) {
            return message.channel.send({
                embeds: [
                    await this.embedFail(
                        message,
                        "This role is higher than me, I cannot add this role!"
                    ),
                ],
            });
        } else if (
            message.author.id !== message.guild?.ownerId &&
			(message.member as GuildMember).roles.highest.position <
				role.position
        ) {
            return message.channel.send({
                embeds: [
                    await this.embedFail(
                        message,
                        "This role is higher than your highest, I cannot add this role!"
                    ),
                ],
            });
        }

        const db = await this.client.db.getOrCreateGuildUser(
            BigInt(member.id),
            BigInt(message.guildId)
        );

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
            } catch (err) {
                throw new Error("Failed to remove user role.\n" + err);
            }

            return message.channel.send({
                embeds: [
                    await this.embedSuccess(
                        message,
                        `Removed role ${userRole?.name ?? String(db.UserRole)} from ${member.user.username}`
                    ),
                ],
            });
        } else {
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
            return message.channel.send({
                embeds: [
                    await this.embedSuccess(
                        message,
                        `Adding role ${role.name} to ${member.user.username}`
                    ),
                ],
            });
        }
    }
}
