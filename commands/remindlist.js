const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const remind = require("./remind");
const ReminderList = new db.table("ReminderList");

module.exports = {
	name: "todolist",
	aliases: ["list", "todolist", "reminder", "remindlist"],
	description: "Fetches your list",
	args: false,
	usage: "type the command",
	async execute(message) {
		const color = message.member.displayColor;
		const guildmemb = message.author;        
		const reminder = ReminderList.fetch(`${guildmemb.id}`);
		const combinedParentArray = reminder.map(a => a.join(" "));
		const todolist = combinedParentArray.map((item, i) => `${+i+1}. ${item}`).join("\n");
		const embed = new MessageEmbed({
			title: "Todo:",
			description: todolist,
			color,
		});
		if (reminder === null){
			embed.setDescription("You havent added any todo lists, yet.");
			return message.channel.send(embed);
		}
		if (combinedParentArray.toString().length > 2048) {	// Embed limits
			const surplus = embed.description.toString().substring(2045, 2300);
			embed.description = embed.description.toString().substring(0, 2045);
			embed.addField("\u200B", surplus); // Maybe iterate something here.
			embed.setFooter("Your list is limited to 2048 characters.");
		}
		await message.channel.send(embed);
	},
};