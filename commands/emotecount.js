const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const Emotes = new db.table("Emotes");

module.exports = {
	name: "emotecount",
	cooldown: 8,
	aliases: ["emojicount"],
	description: "Shows how many times each emote has been used",
	args: false,
	usage: "\n",
	async execute(message) {
		const embed = new MessageEmbed()
			.setTitle("Emoji count list")
			.setAuthor(new Date());
		const embed2 = new MessageEmbed();
		const embed3 = new MessageEmbed();
		const embed4 = new MessageEmbed();
		const GuildEmoteCount = Emotes.get(`${message.guild.id}`);
		let data = "";
		let data2 = "";
		let data3 = "";
		let data4 = "";
		for (const [key, value] of Object.entries(GuildEmoteCount)) {	
			const Emote = message.guild.emojis.cache.find(emote => emote.name === key);	
			if (data.length < 2000) {
				data += `${Emote} \`${Object.values(value)}\` `;
			}
			if (data.length > 2000 && data2.length < 2000) {
				data2 += `${Emote} \`${Object.values(value)}\` `;
			}
			if (data2.length > 2000 && data3.length < 2000) {
				data3 += `${Emote} \`${Object.values(value)}\` `;
			}
			if (data3.length > 2000 && data4.length < 2000) {
				data4 += `${Emote} \`${Object.values(value)}\` `;
			}
		}
		embed.setDescription(data);
		embed2.setDescription(data2);
		embed3.setDescription(data3);
		embed4.setDescription(data4);
		message.channel.send(embed);
		if (data2) {
			setTimeout(() => {  message.channel.send(embed2); }, 2000);
		}
		if (data3) {
			setTimeout(() => {  message.channel.send(embed3); }, 3000);
		}
		if (data4) {
			setTimeout(() => {  message.channel.send(embed3); }, 4000);
		}
	},
};
