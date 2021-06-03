import { Listener } from "@cataclym/discord-akairo";
import { Interaction } from "discord.js";
import logger from "loglevel";
import { errorMessage } from "../lib/Embeds";
import { ExcludeSlashCommand } from "../lib/slashCommands/functions";

export default class InteractionListener extends Listener {
	constructor() {
		super("interaction", {
			event: "interaction",
			emitter: "client",
		});
	}

	public async exec(interaction: Interaction): Promise<any> {
		if (!interaction.isCommand() || !interaction.guild || interaction.commandName !== "exclude") {
			return;
		}
		else if (interaction.guild.me?.permissions.has("MANAGE_ROLES")) {
			return ExcludeSlashCommand(interaction)
				.catch((er) => logger.trace(er));
		}
		else {
			interaction.reply({ ephemeral: true, embeds: [await errorMessage(interaction.user.lastMessage!,
				"I do not have `MANAGE_ROLES` permisssion.")] });
		}
	}
}

