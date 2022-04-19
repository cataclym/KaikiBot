import { ExcludedStickyRoles, Guilds } from "@prisma/client";
import { Collection, Message, MessageEmbed, Permissions, Role, Snowflake } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

class UncachedObject {
    public name: string;

    constructor(data: string) {
        this.name = data;
    }
}

export default class ExcludeStickyRolesCommand extends KaikiCommand {
    constructor() {
        super("excludestickyroles", {
            aliases: ["excludestickyroles", "estickyroles", "estickyrole", "esrole"],
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            description: "Exclude or include a role from stickyroles. Provide no parameter to show a list of excluded roles.\nIf someone who had one or more excluded roles, re-joins this server, they wont get any excluded roles.",
            usage: ["", "@excludedRole @anotherRole"],
            args: [
                {
                    id: "roles",
                    type: "roles",
                },
            ],
        });
    }

    public async exec(message: Message<true>, { roles }: { roles: Collection<Snowflake, Role> }) {

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
            guildDb = await this.client.db.getOrCreateGuild(bigIntGuildId) as (Guilds & { ExcludedStickyRoles: ExcludedStickyRoles[] });
            guildDb["ExcludedStickyRoles"] = [];
        }

        const embed = new MessageEmbed()
            .setTitle("Excluded sticky-roles")
            .withOkColor(message);

        if (!roles) {
            return message.channel.send({
                embeds: [embed.setDescription((guildDb?.ExcludedStickyRoles ?? [])
                    .map(k => message.guild.roles.cache.get(String(k.RoleId)) ?? new UncachedObject(String(k.RoleId)))
                    .sort((a, b) => {
                        return a.name < b.name
                            ? -1
                            : 1;
                    })
                    .join("\n").trim() ?? "No roles excluded")
                    .withOkColor(message)],
            });
        }

        const GuildId = BigInt(message.guildId!), enabledRoles: bigint[] = [],
            excludedRoles: { GuildId: bigint, RoleId: bigint }[] = [];

        for (const [, role] of roles) {

            if (guildDb?.ExcludedStickyRoles.find(c => String(c.GuildId) === role.id)) {
                enabledRoles.push(BigInt(role.id));
            }

            else {
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
            embed.addField("Excluded", excludedRoles
                .map(k => message.guild.channels.cache.get(String(k.RoleId)) ?? String(k.RoleId))
                .join("\n"));
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
            embed.addField("Un-excluded", enabledRoles
                .map(k => message.guild.channels.cache.get(String(k)) ?? String(k))
                .join("\n"));
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
