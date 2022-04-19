import { PrismaClient } from "@prisma/client";
import chalk from "chalk";


import { Guild, GuildMember, Permissions, Role } from "discord.js";
import logger from "loglevel";
import Constants from "../struct/Constants";
import KaikiAkairoClient from "./Kaiki/KaikiAkairoClient";

export default class AnniversaryRolesService {
    readonly client: KaikiAkairoClient;
    readonly orm: PrismaClient;
    listUsersCakeDay: string[] = [];
    listUserJoinedAt: string[] = [];

    constructor(client: KaikiAkairoClient) {
        this.client = client;
        this.orm = client.orm;

        (async () => await this.birthdayService())();
    }

    async birthdayService(): Promise<void> {

        const enabledGuilds = await this.getEnabledGuilds();
        logger.info(`birthdayService | Checking ${chalk.green(enabledGuilds.length)} guilds`);
        await this.handleAnniversaryGuilds(enabledGuilds);
        return this.resetArrays();
    }

    private static async dateObject() {
        const d = new Date();
        const Month = d.getMonth();
        const Day = d.getDate();
        return { Month, Day };
    }

    async checkBirthdayOnAdd(guild: Guild): Promise<void> {

        const enabled = await this.orm.guilds.findUnique({
                where: {
                    Id: BigInt(guild.id),
                },
                select: {
                    Anniversary: true,
                },
            }),
            { Day, Month } = await AnniversaryRolesService.dateObject();

        logger.info(`birthdayService | Checking newly added guild ${guild.name} [${guild.id}]`);

        if (enabled && enabled.Anniversary) {
            try {
                if (guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                    const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await this.handleGuildRoles(guild);
                    // Get roles from the result of checking if guild has the roles at all / after creating them.
                    await Promise.all(guild.members.cache.map(async (member) => {
                        if (!member.user.bot) {
                            // Don't assign special roles to bots.
                            await this.memberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
                        }
                    }));
                }
                else {
                    return logger.warn(`birthdayService | ${guild.name} [${guild.id}] - can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`);
                }
            }
            catch (err) {
                logger.error(err);
            }
            finally {
                logger.info(`birthdayService | Finished checking ${guild.name} [${guild.id}] - Anniversary enabled`);
            }
        }
        else {
            logger.info(`birthdayService | Finished checking ${guild.name} [${guild.id}] - Anniversary disabled`);
        }
    }

    async handleGuildRoles(guild: Guild): Promise<Role[] | unknown[]> {
        if (!guild.roles.cache.some(r => r.name === Constants.AnniversaryStrings.roleNameJoin)) {
            guild.roles.create({
                name: Constants.AnniversaryStrings.roleNameJoin,
                reason: "Role didn't exist yet",
            }).catch(err => logger.error(err));
        }
        if (!guild.roles.cache.some(r => r.name === Constants.AnniversaryStrings.roleNameCreated)) {
            guild.roles.create({
                name: Constants.AnniversaryStrings.roleNameCreated,
                reason: "Role didn't exist yet",
            }).catch(err => logger.error(err));
        }
        const AnniversaryRoleJ = guild.roles.cache.find(r => r.name === Constants.AnniversaryStrings.roleNameJoin);
        const AnniversaryRoleC = guild.roles.cache.find(r => r.name === Constants.AnniversaryStrings.roleNameCreated);

        return [AnniversaryRoleC, AnniversaryRoleJ];
    }

    async checkAnniversaryMember(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        const { guild } = member,
            enabled = await this.orm.guilds.findUnique({
                where: {
                    Id: BigInt(guild.id),
                },
                select: {
                    Anniversary: true,
                },
            });

        if (enabled && enabled.Anniversary) {
            const { Day, Month } = await AnniversaryRolesService.dateObject();

            try {
                if (guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                    const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await this.handleGuildRoles(guild);
                    // Get roles from the result of checking if guild has the roles at all / after creating them.
                    await this.memberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
                }
            }
            catch (err) {
                logger.error(err);
            }
            finally {
                logger.info(`birthdayService | Checked user ${member.user.tag} in ${guild.name} [${guild.id}]`);
            }
        }
    }

    private async memberCheckAnniversary(member: GuildMember, AnniversaryRoleC: Role, AnniversaryRoleJ: Role, Day: number, Month: number) {
        if (member.user.createdAt.getMonth() === Month) {
            if (member.user.createdAt.getDate() === Day) {
                this.listUsersCakeDay.push(member.user.tag);
                if (!member.roles.cache.has(AnniversaryRoleC.id)) {
                    await member.roles.add(AnniversaryRoleC);
                }
            }
        }
        if (member.joinedAt?.getMonth() === Month && member.joinedAt.getFullYear() !== new Date().getFullYear()) {
            if (member.joinedAt.getDate() === Day) {
                this.listUserJoinedAt.push(member.user.tag);
                if (!member.roles.cache.has(AnniversaryRoleJ.id)) {
                    return member.roles.add(AnniversaryRoleJ);
                }
            }
        }
        if (!this.listUsersCakeDay.includes(member.user.tag)) {
            if (member.roles.cache.has(AnniversaryRoleC.id)) {
                await member.roles.remove(AnniversaryRoleC.id, AnniversaryRoleJ.id);
            }
            if (member.roles.cache.has(AnniversaryRoleJ.id)) {
                await member.roles.remove(AnniversaryRoleJ.id);
            }
        }
        return member;
    }

    private async getEnabledGuilds() {
        const dbRes = await this.orm.guilds.findMany({
            where: {
                Anniversary: true,
            },
        });
        return dbRes.map(s => this.client.guilds.cache.get(String(s.Id)))
            .filter((g): g is Guild => !!g);
    }

    private async resetArrays() {
        this.listUserJoinedAt = [];
        this.listUsersCakeDay = [];
    }

    private async handleAnniversaryGuilds(enabledGuilds: Guild[]) {

        const { Day, Month } = await AnniversaryRolesService.dateObject();
        await Promise.all(enabledGuilds.map(async (guild) => {
            // Check if guild is enabled.
            if (guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                // Check if perms.
                const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await this.handleGuildRoles(guild);
                // Get roles from the result of checking if guild has the roles at all / after creating them.
                await Promise.all(guild.members.cache.map(async (member) => {
                    if (!member.user.bot) {
                        // Don't assign special roles to bots.
                        await this.memberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
                    }
                }));
            }
        }));
    }
}
