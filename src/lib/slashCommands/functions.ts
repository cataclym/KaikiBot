import { CommandInteraction, GuildMemberRoleManager, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { Exclude } from "../Embeds";
import { Snowflake } from "discord-api-types/globals";

export async function ExcludeSlashCommand(interaction: CommandInteraction): Promise<void> {

	if (!interaction.guild!.isDadBotEnabled()) {
		return interaction.reply({
			ephemeral: true,
			embeds: [new MessageEmbed()
				.setTitle("Dadbot is not enabled")
				.withErrorColor()],
		});
	}

	const db = await getGuildDocument(interaction.guildID as Snowflake);
	const roleName = db.settings.excludeRole;

	let excludedRole = interaction.guild?.roles.cache.find((r) => r.name === roleName);

	let created = false;

	if (!interaction.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
		excludedRole = await interaction.guild?.roles.create({
			name: roleName,
			reason: "Role didn't exist yet.",
		});

		await interaction.reply({
			ephemeral: true, embeds: [new MessageEmbed({
				title: "Error!",
				description: `A role with name \`${roleName}\` was not found in guild. Creating... `,
				footer: { text: "Beep boop..." },
			})
				.withErrorColor()] });
		created = true;
	}

	if (interaction.member?.roles instanceof GuildMemberRoleManager && !interaction.member?.roles.cache.find((r) => r === excludedRole)
        && excludedRole) {
		await interaction.member?.roles.add(excludedRole);
		created
			? interaction.webhook.send({ ephemeral: true, embeds: [Exclude.addedRoleEmbed(roleName)
				.withOkColor()] })
			: interaction.reply({ ephemeral: true, embeds: [Exclude.addedRoleEmbed(roleName)
				.withOkColor()] });
		return;
	}

	if (interaction.member?.roles instanceof GuildMemberRoleManager && interaction.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
		await interaction.member?.roles.remove(excludedRole);
		created
			? interaction.webhook.send({ ephemeral: true, embeds: [Exclude.removedRoleEmbed(roleName)
				.withOkColor()] })
			: interaction.reply({ ephemeral: true, embeds: [Exclude.removedRoleEmbed(roleName)
				.withOkColor()] });
		return;
	}
}
