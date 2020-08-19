const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const Emotes = new db.table("Emotes");
const paginationEmbed = require("discord.js-pagination");

module.exports = {
	name: "emotecount",
	cooldown: 15,
	aliases: ["emojicount"],
	description: "Shows amount of times each emote has been used",
	args: false,
	usage: "\n",
	cmdCategory: "Utility",
	async execute(message) {

		const GuildEmoteCount = Emotes.get(`${message.guild.id}`);
		const data = [];
		for (const [key, value] of Object.entries(GuildEmoteCount)) {
			const Emote = message.guild.emojis.cache.get(key);
			if (!Emote) { continue; }
			data.push(`${Emote} \`${Object.values(value)}\` `);
		}
		const pages = [];
		for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {
			const dEmbed = new MessageEmbed()
				.setTitle("Emoji count list")
				.setAuthor(message.author.tag)
				.setDescription(data.slice(p, i).join(""));
			pages.push(dEmbed);
		}
		paginationEmbed(message, pages);
	},
};
