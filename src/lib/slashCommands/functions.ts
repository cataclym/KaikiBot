import { APIMessage, CommandInteraction, GuildMemberRoleManager, Message, MessageEmbed } from "discord.js";
import { config } from "../../config";
import { Exclude } from "../Embeds";

export async function ExcludeSlashCommand(interaction: CommandInteraction): Promise<Message | APIMessage | any> {

	let excludedRole = interaction.guild?.roles.cache.find((r) => r.name === config.dadbotRole);

	let created = false;

	if (!interaction.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
		excludedRole = await interaction.guild?.roles.create({
			name: config.dadbotRole,
			reason: "Role didn't exist yet.",
		});
		await interaction.reply(
			{ ephemeral: true, embeds: [new MessageEmbed({
				title: "Error!",
				description: `A role with name \`${config.dadbotRole}\` was not found in guild. Creating... `,
				footer: { text: "Beep boop..." },
			})
				.withErrorColor(interaction.user.lastMessage!)] });
		created = true;
	}

	if (interaction.member?.roles instanceof GuildMemberRoleManager && !interaction.member?.roles.cache.find((r) => r === excludedRole)
        && excludedRole) {
		await interaction.member?.roles.add(excludedRole);
		return created
			? interaction.webhook.send(Exclude.addedRoleEmbed
				.withOkColor(interaction.user.lastMessage!))
			: interaction.reply({ ephemeral: true, embeds: [Exclude.addedRoleEmbed
				.withOkColor(interaction.user.lastMessage!)] });
	}

	if (interaction.member?.roles instanceof GuildMemberRoleManager && interaction.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
		await interaction.member?.roles.remove(excludedRole);
		return created
			? interaction.webhook.send(Exclude.removedRoleEmbed
				.withOkColor(interaction.user.lastMessage!))
			: interaction.reply({ ephemeral: true, embeds: [Exclude.removedRoleEmbed
				.withOkColor(interaction.user.lastMessage!)] });
	}
}