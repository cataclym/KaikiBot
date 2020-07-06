const Discord = require("discord.js");
const db = require("quick.db");
const Tinder = new db.table("Tinder");

module.exports = {
	name: "tinder",
	aliases: ["date","lfd","ons"],
	description: "Suggests someone to date",
	args: false,
	usage: "Just try it.",
	async execute(message) {

		const color = await message.member.displayColor;
		const RandomUsr = await message.guild.members.cache.random();
		const TinderSlogan = ["Match?","Chat?","Date?"];
		const RandomTinderS = TinderSlogan[Math.floor(Math.random() * TinderSlogan.length)];
        
		const married = await Tinder.has(`Tinder.marry.${message.author.id}`);
		const likes = await Tinder.has(`Tinder.likes.${message.author.id}`);
		const dislikes = await Tinder.has(`Tinder.dislikes.${message.author.id}`);
		const dating = await Tinder.has(`Tinder.dating.${message.author.id}`);

		if (!married) {
			const EmbeDDD = new Discord.MessageEmbed()
				.setColor(color)
				.setAuthor(RandomTinderS)
				.setTitle(RandomUsr.user.username)
				.setFooter("React '❌' to dislike. '💚' To like. '🌟' To super like.")
				.setImage(RandomUsr.user.displayAvatarURL());
			message.channel.send(EmbeDDD).then(SentMsg => {
				SentMsg.react("❌");
				SentMsg.react("💚");
				SentMsg.react("🌟");
            
				const filter = (reaction, user) => {
					return ["❌", "💚"].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				message.awaitReactions(filter, { max: 1, time: 15000, errors: ["time"] })
					.then(collected => {
						const reaction = collected.first();

						if (reaction.emoji.name == "❌") {
							message.channel.send(`${RandomUsr.user.username} has been added to dislikes.`);
							message.react("✅");
						}
						if (reaction.emoji.name == "💚") {
							if (Tinder.has(`Tinder.likes.${RandomUsr.id}`, message.author.id)) {
								Tinder.push(`Tinder.dating.${message.author.id}`, RandomUsr.id);
								Tinder.push(`Tinder.dating.${RandomUsr.id}`, message.author.id);
								return message.channel.send("It's a match!! ❤️");
							}
							Tinder.push(`Tinder.likes.${message.author.id}`, RandomUsr.id);
							message.channel.send("Aww ❤️");
							message.react("✅");
						} else {
							message.channel.send("WIP");
							message.react("❌❌❌");
						}
					})
					.catch(collected => {
						const nwmbed = new Discord.MessageEmbed(EmbeDDD)
							.setFooter("Timed out");
						SentMsg.edit(nwmbed);
						SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
					});
			});
		}
	},
};