const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const Emotes = new db.table("Emotes");

module.exports = {
	name: "emotecount",
	aliases: ["emojicount"],
	description: "Shows how many times each emote has been used",
	args: false,
	usage: "\n",
	async execute(message) {
		const embed = new MessageEmbed()
			.setTitle("Emoji count list");
		const embed2 = new MessageEmbed()
			.setFooter(new Date());
		const GuildEmoteCount = Emotes.get(`${message.guild.id}`);
		let data = "";
		let data2 = "";
		for (const [key, value] of Object.entries(GuildEmoteCount)) {	
			const Emote = message.guild.emojis.cache.find(emote => emote.name === key);	
			if (data.length < 2000) {
				data += `${Emote} \`${Object.values(value)}\` `;
			}
			if (data.length > 2000 && data2.length < 2000) {
				data2 += `${Emote} \`${Object.values(value)}\` `;
			}
		}
		embed.setDescription(data);
		embed2.setDescription(data2);
		message.channel.send(embed);
		setTimeout(() => {  message.channel.send(embed2); }, 2000);
	},
};