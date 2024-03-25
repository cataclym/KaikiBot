import { ExcludedStickyRoles, Guilds } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "excludestickyroles",
    aliases: ["estickyroles", "estickyrole", "esrole"],
    description: `Exclude or include one or multiple roles from stickyroles. Provide no parameter to show a list of excluded roles.
    If someone who had one or more excluded roles, re-joins this server, they wont get any excluded roles.`,
    usage: ["", "@excludedRole @anotherRole"],
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
})
export default class ExcludeStickyRolesCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args) {
        const roles = await args.repeat("role").catch(() => undefined);

        const bigIntGuildId = BigInt(message.guildId);
        let guildDb = await this.client.orm.guilds.findUnique({
            where: {
                Id: bigIntGuildId,
            },
            select: {
                ExcludedStickyRoles: true,
            },
        });

        if (!guildDb) {
            guildDb = (await this.client.db.getOrCreateGuild(
                bigIntGuildId
            )) as Guilds & {
                ExcludedStickyRoles: ExcludedStickyRoles[];
            };
            guildDb["ExcludedStickyRoles"] = [];
        }

        const embed = new EmbedBuilder()
            .setTitle("Excluded sticky-roles")
            .withOkColor(message);

        if (!roles) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            guildDb?.ExcludedStickyRoles.length
                                ? guildDb.ExcludedStickyRoles.map((k) => {
                                      const role =
                                          message.guild.roles.cache.get(
                                              String(k.RoleId)
                                          );

                                      return role
                                          ? `${role.name} [${role.id}]`
                                          : String(k.RoleId);
                                  })
                                      .sort((a, b) => (a < b ? -1 : 1))
                                      .join("\n")
                                      .trim()
                                : "No roles excluded"
                        )
                        .withOkColor(message),
                ],
            });
        }

        const GuildId = BigInt(message.guildId),
            enabledRoles: bigint[] = [],
            excludedRoles: { GuildId: bigint; RoleId: bigint }[] = [];

        for (const role of roles) {
            if (
                guildDb?.ExcludedStickyRoles.find(
                    (c) => String(c.RoleId) === role.id
                )
            ) {
                enabledRoles.push(BigInt(role.id));
            } else {
                excludedRoles.push({
                    GuildId,
                    RoleId: BigInt(role.id),
                });
            }
        }

        if (excludedRoles.length) {
            await this.client.orm.excludedStickyRoles.createMany({
                data: excludedRoles,
                skipDuplicates: true,
            });
            embed.addFields([
                {
                    name: "Excluded",
                    value: excludedRoles
                        .map((k) => {
                            const role = message.guild.roles.cache.get(
                                String(k.RoleId)
                            );

                            return role
                                ? `${role.name} [${role.id}]`
                                : String(k.RoleId);
                        })
                        .join("\n"),
                },
            ]);
        }

        if (enabledRoles.length) {
            await this.client.orm.excludedStickyRoles.deleteMany({
                where: {
                    RoleId: {
                        in: enabledRoles,
                    },
                    GuildId: bigIntGuildId,
                },
            });
            embed.addFields([
                {
                    name: "Un-excluded",
                    value: enabledRoles
                        .map((k) => {
                            const role = message.guild.roles.cache.get(
                                String(k)
                            );

                            return role
                                ? `${role.name} [${role.id}]`
                                : String(k);
                        })
                        .join("\n"),
                },
            ]);
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
