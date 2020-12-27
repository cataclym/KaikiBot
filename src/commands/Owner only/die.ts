import { MessageEmbed } from "discord.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

module.exports = class KillBotProcess extends Command {
	constructor() {
		super("die", {
			aliases: ["die", "kill", "shutdown"],
			description: { description: "Shuts down bot." },
			ownerOnly: true,
		});
	}
	public async exec(message: Message) {
		const embed = new MessageEmbed()
			.setAuthor("Dying", message.client.user?.displayAvatarURL({ dynamic: true }))
			.addField("Shutting down", "See you later", false)
			.setColor(await message.getMemberColorAsync());
		await message.channel.send(embed);
		console.log("Shutting down");
		process.exit(1);
	}
};
