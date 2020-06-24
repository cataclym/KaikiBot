const { prefix } = require("../config.json");
const { MessageEmbed } = require("discord.js");


module.exports = {
	name: "send",
	description: "Sends your desired msg",
	args: true,
	usage: "${stuff_here}",
	execute(message, args) {
		const reply = [`${args[0]}`,`${args[1]}`,`${args[2]}`,`${args[3]}`,`${args[4]}`,`${args[5]}`];
		const filtered = reply.filter(word => word.array !== undefined);
		const embed = new MessageEmbed({
			"title": "Success",
			"description": `${filtered}`,
		});

		message.channel.send(embed);
	},};