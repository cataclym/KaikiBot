import { GuildMember, Message, Role } from "discord.js";
import logger from "loglevel";
import chalk from "chalk";
import KaikiAkairoClient from "Kaiki/KaikiAkairoClient";

type genericArrayFilter = <T>(x: T | undefined) => x is T;

export async function handleStickyRoles(member: GuildMember) {

    if (!await member.client.guildProvider.get(member.guild.id, "StickyRoles", 0)) return;

    const result = await restoreUserRoles(member);
    if (!result) {
        return;
    }

    else if (result.success) {
        logger.info(`stickyRoles | Re-added roles to ${chalk.blueBright(member.user.tag)} [${chalk.blueBright(member.id)}]`);
    }

    else {
        logger.warn(`stickyRoles | Bot cannot add roles due to role-hierarchy!! ${chalk.blueBright(member.guild.name)} [${chalk.blueBright(member.guild.id)}]`);
    }
}

export async function restoreUserRoles(member: GuildMember): Promise<{ success: boolean, roles: Role[]} | false> {
    const { guild } = member;
    const leaveRoles = await (member.client as KaikiAkairoClient).orm.leaveRoles.findMany({
        where: {
            GuildUsers: {
                UserId: BigInt(member.id),
                GuildId: BigInt(guild.id),
            },
        },
    });

    const excludedRoleIds = (await member.client.orm.excludedStickyRoles.findMany({
        where: {
            Guilds: {
                Id: BigInt(member.guild.id),
            },
        },
    })).map(t => t.RoleId);

    if (leaveRoles && leaveRoles.length) {

        // Get all roles that still exist in guild.
        // Filter everyone role
        // Then filter out undefined.
        const roleIDArray = leaveRoles
            .map(roleTable => guild.roles.cache.get(String(roleTable.RoleId)))
            .filter(Boolean as unknown as genericArrayFilter)
            .filter(r => r.position !== 0);

        // Making sure bot doesn't add roles the user already have,
        // and don't add roles above bot in role hierarchy
        const rolesToAdd = roleIDArray.filter(r => !member.roles.cache.has(r.id)
                && r.position < guild.me!.roles.highest.position);

        if (!rolesToAdd.length) {
            return {
                success: false,
                roles: rolesToAdd,
            };
        }

        if (excludedRoleIds.length && rolesToAdd.some(r => excludedRoleIds.includes(BigInt(r.id)))) {
            // Return false when it finds an excluded role among the leave roles.
            return false;
        }

        // Add all roles
        // Map roles to ID, because D.js didn't like it otherwise
        await member.roles.add(rolesToAdd.map(r => r.id));

        return {
            success: true,
            roles: rolesToAdd,
        };
    }
    return false;
}

export async function rolePermissionCheck(message: Message<true>, role: Role) {
    if ((role.position < (message.member?.roles.highest.position || 0)
            || message.guild.ownerId === message.member?.id)
        && !role.managed) {
        return botRolePermissionCheck(message, role);
    }
    return false;
}

export async function botRolePermissionCheck(message: Message<true>, role: Role) {
    return role.position < (message.guild.me?.roles.highest.position || 0);
}

