const Discord = require("discord.js");
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { prefix } = require("../config.js");

module.exports = {
	name: "tinder",
	aliases: ["date","lfd","ons"],
	description: "Suggests someone to date",
	args: false,
	usage: "Just try it.",
	async execute(message, args) {

		if (args[0] == "refill") {
			await Tinder.add(`rolls.${message.author.id}`, 10);
			await Tinder.add(`likes.${message.author.id}`, 3);
		}

		if (!Tinder.has(`rolls.${message.author.id}`)) {
			await Tinder.add(`rolls.${message.author.id}`, 10);
			await Tinder.add(`likes.${message.author.id}`, 3);
			await Tinder.push(`dating.${message.author.id}`, message.author.id);
			await Tinder.push(`likeID.${message.author.id}`, message.author.id);
			await Tinder.push(`dislikeID.${message.author.id}`, message.author.id);	
			await Tinder.push(`married.${message.author.id}`, message.author.id);
		}
		const color = await message.member.displayColor;
		const RandomUsr = await message.guild.members.cache.random();
		const TinderSlogan = ["Match?","Chat?","Date?"];
		const RandomTinderS = TinderSlogan[Math.floor(Math.random() * TinderSlogan.length)];
		const hasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
		const haslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		console.log(prefix + "tinder | Executed in: '" + message.channel.name + "' On: '"+ Date() + "'\n" + message.author.username + " has: Rolls left : " + hasrolls + ". Likes left : " + haslikes);

		const RollsLikes = hasrolls + " rolls " + haslikes + " likes remaining.";
		
		if (hasrolls > 0) {
			Tinder.subtract(`rolls.${message.author.id}`, 1);
			const EmbeDDD = new Discord.MessageEmbed()
				.setColor(color)
				.setAuthor(RandomTinderS)
				.setTitle(RandomUsr.user.username)
				.setDescription(RandomUsr.displayName)
				.setFooter("React '❌' to dislike. '💚' To like. '🌟' To super like.\n" + RollsLikes)
				.setImage(RandomUsr.user.displayAvatarURL());
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
								if (haslikes > 0) {
									const zero = parseInt(0, 10);
									Tinder.push(`dating.${message.author.id}`, RandomUsr.id);
									Tinder.push(`dating.${RandomUsr.id}`, message.author.id);
									Tinder.set(`rolls.${message.author.id}`, zero);
									Tinder.set(`likes.${message.author.id}`, zero);
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									const nwmbed = new Discord.MessageEmbed(EmbeDDD)
										.setColor("#00FF00")
										.setFooter(RandomUsr.user.username + " is now dating you!\nYou have no rolls or likes remaining.")
										.setAuthor("🌟❤️🌟");
									return SentMsg.edit(nwmbed);
								}
								else {
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("You have no more likes!");
								}
							}
							case "💚": {
								if (haslikes > 0) {
									Tinder.subtract(`likes.${message.author.id}`, 1);
									if (Tinder.has(`likeID.${RandomUsr.id}`)) {
										const checklikeID = Tinder.get(`likeID.${RandomUsr.id}`);
										if (checklikeID.includes(`${message.author.id}`)) {
											Tinder.push(`dating.${message.author.id}`, RandomUsr.id);
											Tinder.push(`dating.${RandomUsr.id}`, message.author.id);
											SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
											const nwmbed = new Discord.MessageEmbed(EmbeDDD)
												.setColor("#ff00ff")
												.setTitle("It's a match! Congratulations!")
												.setFooter("🌟❤️🌟");
											return SentMsg.edit(nwmbed);
										}
									}
									Tinder.push(`likeID.${message.author.id}`, RandomUsr.id);
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									const Nhasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
									const Nhaslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
									const NewRollsLikes = Nhasrolls + " rolls " + Nhaslikes + " likes remaining.";
									const nwmbed = new Discord.MessageEmbed(EmbeDDD)
										.setColor("#00FF00")
										.setFooter(RandomUsr.user.username + " has been added to likes!\n" + NewRollsLikes)
										.setAuthor("❤️");
									SentMsg.edit(nwmbed);
								}
								else {
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("You have no more likes!").then(msg => {
										msg.react("⚠️");
									});
								}
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