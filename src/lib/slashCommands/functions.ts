import { CommandInteraction, GuildMemberRoleManager, MessageEmbed, Snowflake } from "discord.js";
import KaikiEmbeds from "../KaikiEmbeds";

export async function ExcludeSlashCommand(interaction: CommandInteraction): Promise<void> {

    if (!interaction.channel?.isText() || !interaction.guild) return interaction.deferReply({ ephemeral:true });

    if (!interaction.guild!.determineIsDadBotEnabled()) {
        return interaction.reply({
            ephemeral: true,
            embeds: [new MessageEmbed()
                .setTitle("Dadbot is not enabled")
                .withErrorColor(interaction.guild)],
        });
    }

    const db = await interaction.client.orm.guilds.findUnique({
        where: {
            Id: BigInt(interaction.guildId as Snowflake),
        },
    });
    if (!db) return;
    const roleId = db.ExcludeRole;

    let excludedRole = interaction.guild?.roles.cache.get(String(roleId));

    let created = false;

    if (!interaction.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
        excludedRole = await interaction.guild?.roles.create({
            name: process.env.DADBOT_DEFAULT_ROLENAME,
            reason: "Role didn't exist yet.",
        });

        await interaction.reply({
            ephemeral: true, embeds: [new MessageEmbed({
                title: "Error!",
                description: `A role with name \`${process.env.DADBOT_DEFAULT_ROLENAME}\` was not found in guild. Creating... `,
                footer: { text: "Beep boop..." },
            })
                .withErrorColor(interaction.guild)] });
        created = true;
    }

    if (interaction.member?.roles instanceof GuildMemberRoleManager && !interaction.member?.roles.cache.find((r) => r === excludedRole)
        && excludedRole) {
        await interaction.member?.roles.add(excludedRole);
        created
            ? await interaction.webhook.send({
                ephemeral: true, embeds: [KaikiEmbeds.addedRoleEmbed(process.env.DADBOT_DEFAULT_ROLENAME!)
                    .withOkColor(interaction.guild)],
            })
            : await interaction.reply({
                ephemeral: true, embeds: [KaikiEmbeds.addedRoleEmbed(process.env.DADBOT_DEFAULT_ROLENAME!)
                    .withOkColor(interaction.guild)],
            });
        return;
    }

    if (interaction.member?.roles instanceof GuildMemberRoleManager && interaction.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
        await interaction.member?.roles.remove(excludedRole);
        created
            ? await interaction.webhook.send({
                ephemeral: true, embeds: [KaikiEmbeds.removedRoleEmbed(process.env.DADBOT_DEFAULT_ROLENAME!)
                    .withOkColor(interaction.guild)],
            })
            : await interaction.reply({
                ephemeral: true, embeds: [KaikiEmbeds.removedRoleEmbed(process.env.DADBOT_DEFAULT_ROLENAME!)
                    .withOkColor(interaction.guild)],
            });
        return;
    }
}
