const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const ReminderList = new db.table("ReminderList");


module.exports = {
	name: "todolist",
	aliases: ["list", "todolist", "reminder", "remindlist"],
	description: "Fetches your list",
	args: false,
	usage: "type the command",
	async execute(message) {
		const color = message.member.displayColor;
		const embed = new MessageEmbed({
			title: "Todo:",
			description: "placeholder",
			color,
		});
		const guildmemb = message.author;        
		const reminder = ReminderList.fetch(`${guildmemb.id}`);
		if (reminder === null){
			embed.setDescription("You havent added any todo lists, yet.");
			return message.channel.send(embed);
		}
		let combinedParentArray = reminder.map(a => a.join(" ")).join("\n");
		if (combinedParentArray.length > 2048) {
			combinedParentArray = combinedParentArray.toString().substring(0, 2045);
			combinedParentArray += "...";
			embed.setDescription(combinedParentArray);
			embed.setFooter("Your list is limited to 2048 characters.");
			return message.channel.send(embed);
		}
		embed.setDescription(combinedParentArray);
		await message.channel.send(embed);
	},
};