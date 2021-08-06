import { Listener } from "discord-akairo";
import { CommandInteraction, Interaction, Message } from "discord.js";
import logger from "loglevel";
import { errorMessage } from "../lib/Embeds";
import { ExcludeSlashCommand } from "../lib/slashCommands/functions";

export default class InteractionListener extends Listener {
	constructor() {
		super("interaction", {
			event: "interactionCreate",
			emitter: "client",
		});
	}

	public async exec(interaction: Interaction): Promise<CommandInteraction | void> {

		if (!interaction.isCommand()) return;

		if (!interaction.guild || interaction.commandName !== "exclude" || !interaction.channel?.isText()) {
			return interaction.deferReply({ ephemeral: true });
		}

		else if (interaction.guild.me?.permissions.has("MANAGE_ROLES")) {
			return ExcludeSlashCommand(interaction)
				.catch((er) => logger.error(er));
		}

		else {
			return await interaction.reply({
				ephemeral: true,
				embeds: [await errorMessage(interaction.guild,
					"I do not have `MANAGE_ROLES` permission.")],
			});
		}
	}
}

