import { MessageActionRow, MessageComponentInteractionCollector, MessageEmbed } from "discord.js";
import { Message, MessageButton } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import logger from "loglevel";

export default class KillBotProcess extends KaikiCommand {
	constructor() {
		super("die", {
			aliases: ["die", "kill", "shutdown"],
			description: "Shuts down bot.",
			ownerOnly: true,
		});
	}

	public async exec(message: Message): Promise<void> {

		const deleteMsg = await message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription("Do you *really* want to shut me down?")
				.withOkColor(message)],
			isInteraction: true,
			components: [new MessageActionRow({
				components:
					[new MessageButton()
						.setCustomID("1")
						.setLabel("Kill me")
						.setStyle("DANGER")],
			})],
		});

		const buttonListener = new MessageComponentInteractionCollector(deleteMsg, {
			dispose: true,
			time: 20000,
			idle: 20000,
			filter: (m) => m.user.id === message.author.id,
		});

		buttonListener.once("collect", async (mci) => {

			buttonListener.stop();
			await deleteMsg.delete();

			await mci.reply({ ephemeral: true, embeds: [new MessageEmbed()
				.setAuthor("Dying", message.client.user?.displayAvatarURL({ dynamic: true }))
				.addField("Shutting down", "See you later", false)
				.withOkColor(message)],
			});

			logger.warn("Shutting down");
			process.exit();
			// SIGINT shutdown
		});

		buttonListener.once("end", async () => {
			await message.delete();
		});
	}
}
