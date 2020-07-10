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

		if (!Tinder.has(`rolls.${message.author.id}`)) {
			await Tinder.add(`rolls.${message.author.id}`, 10);
			await Tinder.add(`likes.${message.author.id}`, 3);
			await Tinder.set(`dating.${message.author.id}`, message.author.id);
			await Tinder.set(`likeID.${message.author.id}`, message.author.id);
			await Tinder.set(`dislikeID.${message.author.id}`, message.author.id);	
			await Tinder.set(`married.${message.author.id}`, message.author.id);
		}

		const color = await message.member.displayColor;
		const RandomUsr = await message.guild.members.cache.random();
		const TinderSlogan = ["Match?","Chat?","Date?"];
		const RandomTinderS = TinderSlogan[Math.floor(Math.random() * TinderSlogan.length)];
		const hasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
		const haslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		console.log("Rolls left "+hasrolls+". Likes left "+haslikes);

		Tinder.subtract(`rolls.${message.author.id}`, 1);
		const RollsLikes = hasrolls + " rolls " + haslikes + " likes remaining.";
		
		if (hasrolls > 0) {
			const EmbeDDD = new Discord.MessageEmbed()
				.setColor(color)
				.setAuthor(RandomTinderS)
				.setTitle(RandomUsr.user.username)
				.setFooter("React '❌' to dislike. '💚' To like. '🌟' To super like.")
				.setImage(RandomUsr.user.displayAvatarURL())
				.setFooter(RollsLikes);
			message.channel.send(EmbeDDD).then(SentMsg => {
				SentMsg.react("❌");
				SentMsg.react("💚");
				SentMsg.react("🌟");

				const filter = (reaction, user) => {
					return ["❌", "💚", "🌟"].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				SentMsg.awaitReactions(filter, { max: 1, time: 25000, errors: ["time"] })
					.then(collected => {
						const reaction = collected.first();
						switch(reaction.emoji.name) { 
							case "❌": {
								Tinder.push(`dislikeID.${message.author.id}`, RandomUsr.id);
								SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return message.channel.send(`${RandomUsr.user.username} has been added to dislikes.`).then(NewReact => {
									NewReact.react("✅");
								});
							}
							case "🌟": {
								Tinder.push(`dating.${message.author.id}`, RandomUsr.id);
								Tinder.push(`dating.${RandomUsr.id}`, message.author.id);
								SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								message.channel.send(`${RandomUsr.user.username} is now dating you!\nYou have no rolls or likes remaining.`);
								return SentMsg.react("✅");
							}
							case "💚": {
								Tinder.subtract(`likes.${message.author.id}`, 1);
								const checklikeID = Tinder.get(`likeID.${RandomUsr.id}`);
								if (checklikeID.includes(`${message.author.id}`)) {
									Tinder.push(`dating.${message.author.id}`, RandomUsr.id);
									Tinder.push(`dating.${RandomUsr.id}`, message.author.id);
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("It's a match!! ❤️").then(NewReact => {
										NewReact.react("✅");
									});
								}
								Tinder.push(`likeID.${message.author.id}`, RandomUsr.id);
								SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return message.channel.send("Aww ❤️").then(NewReact => {
									NewReact.react("✅");
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
		else {
			message.reply("You don't have any more rolls").then(msg => {
				msg.react("⚠️");
			});
		}
	},
};