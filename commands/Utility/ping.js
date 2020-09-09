const { MessageEmbed } = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class PingCommand extends Command {
	constructor() {
		super("ping", {
			name: "ping",
			description: { description: "Ping!" },
			aliases: ["p", "ping"],
		});
	}
	async exec(message) {
		const InitialMSG = await message.channel.send("Pinging...!"),
			WSTime = Math.abs(message.client.ws.ping),
			ClientTime = InitialMSG.createdTimestamp - message.createdTimestamp;
		const color = message.member.displayColor,
			embed = new MessageEmbed({
				fields: [
					{ name: "WebSocket ping", value: WSTime + " ms", inline: true },
					{ name: "Client ping", value: ClientTime + " ms", inline: true }],
				color,
			});
		return InitialMSG.edit(null, embed);
	}
};
