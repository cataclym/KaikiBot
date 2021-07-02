import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { KaikiCommand } from "Kaiki";

module.exports = class KillBotProcess extends KaikiCommand {
	constructor() {
		super("die", {
			aliases: ["die", "kill", "shutdown"],
			description: "Shuts down bot.",
			ownerOnly: true,
		});
	}
	public async exec(message: Message) {

		const embed = new MessageEmbed()
			.setAuthor("Dying", message.client.user?.displayAvatarURL({ dynamic: true }))
			.addField("Shutting down", "See you later", false)
			.withOkColor(message);

		await message.channel.send({ embeds: [embed] });
		console.log("Shutting down");
		process.exit(1);
	}
};
