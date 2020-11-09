import { MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

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
			.setColor(await getMemberColorAsync(message));
		await message.channel.send(embed);
		console.log("Shutting down");
		process.exit(1);
	}
};
