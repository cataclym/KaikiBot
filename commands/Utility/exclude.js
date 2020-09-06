const { MessageEmbed } = require("discord.js");
const { Command } = require("discord-akairo");
const { names } = require("../../config.js");
const embed1 = new MessageEmbed({
	title: "Error!",
	description: `A role with name \`${names}\` was not found in guild. Creating... `,
	footer: { text: "Beep boop..." },
});
const embed2 = new MessageEmbed({
	title: "Success!",
	description: `Added role \`${names}\`.\nType the command again to remove.`,
});
const embed3 = new MessageEmbed({
	title: "Success!",
	description: `Removed role \`${names}\`.\nType the command again to add it back.`,
});

module.exports = class ExcludeCommand extends Command {
	constructor() {
		super("exclude", {
			name: "exclude",
			description: "Adds or removes excluded role from user.",
			aliases: ["exclude", "e", "excl"],
		});
	}
	async exec(message) {
		const color = message.member.displayColor;
		embed1.setColor(color);
		embed2.setColor(color);
		embed3.setColor(color);
		let excludedRole = await message.guild.roles.cache.find((r) => r.name === names);

		if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
			return (message.reply("I don't have `MANAGE_ROLES` permission."));
		}
		if (!message.guild.roles.cache.find((r) => r === excludedRole)) {
			excludedRole = await message.guild.roles.create({
				data: { name: names },
				reason: "Role didn't exist yet",
			}).catch(console.error);
			await (message.channel.send(embed1));
		}
		if (!message.member.roles.cache.find((r) => r === excludedRole)) {
			await message.member.roles.add(excludedRole);
			return message.channel.send(embed2);
		}
		if (message.member.roles.cache.find((r) => r === excludedRole)) {
			await message.member.roles.remove(excludedRole);
			return message.channel.send(embed3);
		}
	}
};
