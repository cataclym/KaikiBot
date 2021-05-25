import { APIMessage, CommandInteraction, GuildMemberRoleManager, Message, MessageEmbed } from "discord.js";
import { getGuildDB } from "../../struct/db";
import { Exclude } from "../Embeds";

export async function ExcludeSlashCommand(interaction: CommandInteraction): Promise<Message | APIMessage | any> {

	const db = await getGuildDB(interaction.guildID as string);
	const rolename = db.settings.excludeRole;

	let excludedRole = interaction.guild?.roles.cache.find((r) => r.name === rolename);

	let created = false;

	if (!interaction.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
		excludedRole = await interaction.guild?.roles.create({
			name: rolename,
			reason: "Role didn't exist yet.",
		});
		await interaction.reply(
			{ ephemeral: true, embeds: [new MessageEmbed({
				title: "Error!",
				description: `A role with name \`${rolename}\` was not found in guild. Creating... `,
				footer: { text: "Beep boop..." },
			})
				.withErrorColor()] });
		created = true;
	}

	if (interaction.member?.roles instanceof GuildMemberRoleManager && !interaction.member?.roles.cache.find((r) => r === excludedRole)
        && excludedRole) {
		await interaction.member?.roles.add(excludedRole);
		return created
			? interaction.webhook.send(Exclude.addedRoleEmbed(rolename)
				.withOkColor())
			: interaction.reply({ ephemeral: true, embeds: [Exclude.addedRoleEmbed(rolename)
				.withOkColor()] });
	}

	if (interaction.member?.roles instanceof GuildMemberRoleManager && interaction.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
		await interaction.member?.roles.remove(excludedRole);
		return created
			? interaction.webhook.send(Exclude.removedRoleEmbed(rolename)
				.withOkColor())
			: interaction.reply({ ephemeral: true, embeds: [Exclude.removedRoleEmbed(rolename)
				.withOkColor()] });
	}
}