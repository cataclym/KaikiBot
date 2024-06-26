import { container } from "@sapphire/pieces";
import * as colorette from "colorette";
import { GuildMember, Message, Role } from "discord.js";
import KaikiUtil from "./KaikiUtil";

export default class Roles {
    static async getRole(message: Message<true>) {
        const db = await message.client.db.getOrCreateGuildUser(
            BigInt(message.author.id),
            BigInt(message.guildId)
        );

        if (!db.UserRole) return false;

        const myRole = message.guild.roles.cache.get(String(db.UserRole));

        if (!myRole) {
            await message.client.orm.guildUsers.update({
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
            return false;
        }

        return myRole;
    }

    static async handleStickyRoles(member: GuildMember) {
        if (
            !(await member.client.guildsDb.get(
                member.guild.id,
                "StickyRoles",
                0
            ))
        )
            return;

        const result = await Roles.restoreUserRoles(member);

        if (!result) return;

        if (result.success) {
            container.logger.info(
                `stickyRoles | Re-added roles to ${colorette.blueBright(member.user.username)} [${colorette.blueBright(member.id)}]`
            );
        } else {
            container.logger.warn(
                `stickyRoles | Bot cannot add roles due to role-hierarchy!! ${colorette.blueBright(member.guild.name)} [${colorette.blueBright(member.guild.id)}]`
            );
        }
    }

    static async restoreUserRoles(
        member: GuildMember
    ): Promise<{ success: boolean; roles: Role[] } | false> {
        const { guild } = member;
        const leaveRoles = await member.client.orm.leaveRoles.findMany({
            where: {
                GuildUsers: {
                    UserId: BigInt(member.id),
                    GuildId: BigInt(guild.id),
                },
            },
        });

        const excludedRoleIds = (
            await member.client.orm.excludedStickyRoles.findMany({
                where: {
                    Guilds: {
                        Id: BigInt(member.guild.id),
                    },
                },
                select: {
                    RoleId: true,
                },
            })
        ).map((t) => t.RoleId);

        if (leaveRoles.length) {
            // Filter excluded roles
            // Resolve IDs to roles in guild
            // Filter out unresolved roles/undefined
            // Filter everyone role
            // Filter to make sure bot doesn't add roles the user already have,
            // and don't add roles above bot in role hierarchy
            const rolesToAdd = leaveRoles
                .filter((r) => !excludedRoleIds.includes(r.RoleId))
                .map((roleTable) =>
                    guild.roles.cache.get(String(roleTable.RoleId))
                )
                .filter(KaikiUtil.genericArrayFilter)
                .filter(
                    (r) =>
                        r.position !== 0 &&
						!member.roles.cache.has(r.id) &&
						r.position <
							(guild.members.me?.roles.highest.position || 0)
                );

            if (!rolesToAdd.length) {
                return {
                    success: false,
                    roles: rolesToAdd,
                };
            }

            // Add all roles
            // Map roles to ID, because D.js didn't like it otherwise
            await member.roles.add(rolesToAdd.map((r) => r.id));

            return {
                success: true,
                roles: rolesToAdd,
            };
        }
        return false;
    }

    static async rolePermissionCheck(message: Message<true>, role: Role) {
        if (
            (role.position < (message.member?.roles.highest.position || 0) ||
				message.guild.ownerId === message.member?.id) &&
			!role.managed
        ) {
            return Roles.botRolePermissionCheck(message, role);
        }
        return false;
    }

    static async botRolePermissionCheck(message: Message<true>, role: Role) {
        return (
            role.position <
			(message.guild.members.me?.roles.highest.position || 0)
        );
    }
}
