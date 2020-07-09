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
		
				SentMsg.awaitReactions(filter, { max: 1, time: 15000, errors: ["time"] })
					.then(collected => {
						const reaction = collected.first();
						switch(reaction.emoji.name) { 
							case "💚": {
								const checklike = Tinder.get(`Tinder.${RandomUsr.id}.likes`);
								if (checklike.includes(`${message.author.id}`)) {
									Tinder.push(`Tinder.${message.author.id}.dating`, RandomUsr.id);
									Tinder.push(`Tinder.${RandomUsr.id}.dating`, message.author.id);
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("It's a match!! ❤️").then(NewReact => {
										NewReact.react("✅");
									});
								}
								else { 
									Tinder.push(`Tinder.${message.author.id}.likes`, RandomUsr.id);
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("Aww ❤️").then(NewReact => {
										NewReact.react("✅");
									});
								}
							} 
							case "❌": {
								SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return message.channel.send(`${RandomUsr.user.username} has been added to dislikes.`).then(NewReact => {
									NewReact.react("✅");
								});
							}
							case "🌟": {
								SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return message.channel.send("WIP").then(NewReact => {
									NewReact.react("❌❌❌");
								});
							}
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