const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ping",
	args: false,
	description: "Ping!",
	aliases: ["p"],
	usage: "\u200B",
	cmdCategory: "Utility",
	async execute(message) {

		const InitialMSG = await message.channel.send("Pinging...!");
		const color = message.member.displayColor;
		const WSTime = Math.abs(message.client.ws.ping);
		const ClientTime = InitialMSG.createdTimestamp - message.createdTimestamp;
		const embed = new MessageEmbed({
			fields: [
				{ name: "WebSocket ping", value: WSTime + " ms", inline: true },
				{ name: "Client ping", value: ClientTime + " ms", inline: true }],
			color,
		});
		return InitialMSG.edit(null, embed);
	},
};
