import { PrismaClient } from "@prisma/client";
import * as colorette from "colorette";
import { Guild, GuildMember, PermissionsBitField, Role } from "discord.js";
import Constants from "../struct/Constants";
import KaikiSapphireClient from "./Kaiki/KaikiSapphireClient";

export default class AnniversaryRolesService {
    readonly client: KaikiSapphireClient<true>;
    readonly orm: PrismaClient;
    listUsersCakeDay: string[] = [];
    listUserJoinedAt: string[] = [];

    constructor(client: KaikiSapphireClient<true>) {
        this.client = client;
        this.orm = client.orm;

        (async () => await this.birthdayService())();
    }

    async birthdayService(): Promise<void> {
        const enabledGuilds = await this.getEnabledGuilds();
        this.client.logger.info(
            `AnniversaryRolesService | Checking ${colorette.green(enabledGuilds.length)} guilds`
        );
        await this.handleAnniversaryGuilds(enabledGuilds);
        return this.resetArrays();
    }

    private static async dateObject() {
        const date = new Date();
        const month = date.getMonth();
        const day = date.getDate();
        return { month: month, day: day };
    }

    async checkBirthdayOnAdd(guild: Guild): Promise<void> {
        const guildDb = await this.client.db.getOrCreateGuild(BigInt(guild.id)),
            { day, month } = await AnniversaryRolesService.dateObject();

        this.client.logger.info(
            `AnniversaryRolesService | Checking newly added guild ${guild.name} [${guild.id}]`
        );

        if (guildDb.Anniversary) {
            try {
                if (
                    guild.members.me?.permissions.has(
                        PermissionsBitField.Flags.ManageRoles
                    )
                ) {
                    const [anniversaryRoleCreated, anniversaryRoleJoin] = <
                        Role[]
                    >await this.handleGuildRoles(guild);
                    // Get roles from the result of checking if guild has the roles at all / after creating them.
                    await Promise.all(
                        guild.members.cache.map(async (member) => {
                            if (!member.user.bot) {
                                // Don't assign special roles to bots.
                                await this.memberCheckAnniversary(
                                    member,
                                    anniversaryRoleCreated,
                                    anniversaryRoleJoin,
                                    day,
                                    month
                                );
                            }
                        })
                    );
                } else {
                    return this.client.logger.warn(
                        `AnniversaryRolesService | ${guild.name} [${guild.id}] - can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`
                    );
                }
            } catch (err) {
                this.client.logger.error(err);
            } finally {
                this.client.logger.info(
                    `AnniversaryRolesService | Finished checking ${guild.name} [${guild.id}] - Anniversary enabled`
                );
            }
        } else {
            this.client.logger.info(
                `AnniversaryRolesService | Finished checking ${guild.name} [${guild.id}] - Anniversary disabled`
            );
        }
    }

    async handleGuildRoles(guild: Guild): Promise<Role[] | unknown[]> {
        if (
            !guild.roles.cache.some(
                (r) => r.name === Constants.anniversaryStrings.ROLE_JOIN
            )
        ) {
            guild.roles
                .create({
                    name: Constants.anniversaryStrings.ROLE_JOIN,
                    reason: "Role didn't exist yet",
                })
                .catch((err) => this.client.logger.error(err));
        }
        if (
            !guild.roles.cache.some(
                (r) => r.name === Constants.anniversaryStrings.ROLE_CREATED
            )
        ) {
            guild.roles
                .create({
                    name: Constants.anniversaryStrings.ROLE_CREATED,
                    reason: "Role didn't exist yet",
                })
                .catch((err) => this.client.logger.error(err));
        }
        const anniversaryRoleJoin = guild.roles.cache.find(
            (r) => r.name === Constants.anniversaryStrings.ROLE_JOIN
        );
        const anniversaryRoleCreated = guild.roles.cache.find(
            (r) => r.name === Constants.anniversaryStrings.ROLE_CREATED
        );

        return [anniversaryRoleCreated, anniversaryRoleJoin];
    }

    async checkAnniversaryMember(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        const { guild } = member,
            guildDb = await this.client.db.getOrCreateGuild(BigInt(guild.id));

        if (guildDb.Anniversary) {
            const { day, month } = await AnniversaryRolesService.dateObject();

            try {
                if (
                    guild.members.me?.permissions.has(
                        PermissionsBitField.Flags.ManageRoles
                    )
                ) {
                    const [anniversaryRoleCreated, anniversaryRoleJoin] = <
                        Role[]
                    >await this.handleGuildRoles(guild);
                    // Get roles from the result of checking if guild has the roles at all / after creating them.
                    await this.memberCheckAnniversary(
                        member,
                        anniversaryRoleCreated,
                        anniversaryRoleJoin,
                        day,
                        month
                    );
                }
            } catch (err) {
                this.client.logger.error(err);
            } finally {
                this.client.logger.info(
                    `AnniversaryRolesService | Checked user ${member.user.username} in ${guild.name} [${guild.id}]`
                );
            }
        }
    }

    private async memberCheckAnniversary(
        member: GuildMember,
        anniversaryRoleCreated: Role,
        anniversaryRoleJoin: Role,
        day: number,
        month: number
    ) {
        if (member.user.createdAt.getMonth() === month) {
            if (member.user.createdAt.getDate() === day) {
                this.listUsersCakeDay.push(member.user.username);
                if (!member.roles.cache.has(anniversaryRoleCreated.id)) {
                    await member.roles.add(anniversaryRoleCreated);
                }
            }
        }
        if (
            member.joinedAt?.getMonth() === month &&
            member.joinedAt.getFullYear() !== new Date().getFullYear()
        ) {
            if (member.joinedAt.getDate() === day) {
                this.listUserJoinedAt.push(member.user.username);
                if (!member.roles.cache.has(anniversaryRoleJoin.id)) {
                    return member.roles.add(anniversaryRoleJoin);
                }
            }
        }
        if (!this.listUsersCakeDay.includes(member.user.username)) {
            if (member.roles.cache.has(anniversaryRoleCreated.id)) {
                await member.roles.remove(
                    anniversaryRoleCreated.id,
                    anniversaryRoleJoin.id
                );
            }
            if (member.roles.cache.has(anniversaryRoleJoin.id)) {
                await member.roles.remove(anniversaryRoleJoin.id);
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
        return dbRes
            .map((s) => this.client.guilds.cache.get(String(s.Id)))
            .filter((g): g is Guild => !!g);
    }

    private async resetArrays() {
        this.listUserJoinedAt = [];
        this.listUsersCakeDay = [];
    }

    private async handleAnniversaryGuilds(enabledGuilds: Guild[]) {
        const { day, month } = await AnniversaryRolesService.dateObject();
        await Promise.all(
            enabledGuilds.map(async (guild) => {
                // Check if guild is enabled.
                if (
                    guild.members.me?.permissions.has(
                        PermissionsBitField.Flags.ManageRoles
                    )
                ) {
                    // Check if perms.
                    const [anniversaryRoleCreated, anniversaryRoleJoin] = <
                        Role[]
                    >await this.handleGuildRoles(guild);
                    // Get roles from the result of checking if guild has the roles at all / after creating them.
                    await Promise.all(
                        guild.members.cache.map(async (member) => {
                            if (!member.user.bot) {
                                // Don't assign special roles to bots.
                                await this.memberCheckAnniversary(
                                    member,
                                    anniversaryRoleCreated,
                                    anniversaryRoleJoin,
                                    day,
                                    month
                                );
                            }
                        })
                    );
                }
            })
        );
    }
}
