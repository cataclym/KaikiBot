const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "die",
	aliases: ["kill", "shutdown"],
	description: "Turn bot off, then turn it back on.",
	ownerOnly: true,
	cmdCategory: "Owner only",
	async execute(message) {
		const color = message.member.displayColor;
		const embed = new MessageEmbed({
			author: { icon_url: message.client.user.displayAvatarURL(), name: "Dying" },
			fields: { name: "Shutting down", value: "See you later", inline: false },
			color,
		});
		await message.channel.send(embed);
		await console.log("Shutting down");
		await process.exit(1);
	},
};
