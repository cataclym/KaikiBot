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

		if (!Tinder.has(`rolls.${message.author.id}`)) { // So the db/Tinder doesnt choke later...
			Tinder.add(`rolls.${message.author.id}`, 10); 
			Tinder.add(`likes.${message.author.id}`, 3);	
			Tinder.push(`dating.${message.author.id}`, message.author.id);
			Tinder.push(`likeID.${message.author.id}`, message.author.id);
			Tinder.push(`dislikeID.${message.author.id}`, message.author.id);	
			Tinder.push(`married.${message.author.id}`, message.author.id);
		}

		switch (args[0]) { // Remove at final commit.
			case "refill": {
				Tinder.add(`rolls.${message.author.id}`, 10);
				Tinder.add(`likes.${message.author.id}`, 3);
				return message.react("✅");
			}
			case "list": {
				return list();
			}
			case "marry": {
				return message.channel.send("marry");
			}
			case "help": {
				return message.channel.send("WIP");
			}
			case "test": {
				return;
			}
		}

		const likesID = Tinder.get(`likeID.${message.author.id}`);
		const dislikeID = Tinder.get(`dislikeID.${message.author.id}`);	
		const married = Tinder.get(`married.${message.author.id}`);
		const combined = new Array().concat(likesID, dislikeID, married);

		const arr = await message.guild.members.cache.map(member => member.id),
			res = arr.filter(f => !combined.includes(f));
		const randomUserID = res[Math.floor(Math.random() * res.length)];
		const RandomUsr = await message.guild.members.cache.get(randomUserID);

		const color = await message.member.displayColor;
		//const RandomUsr = await message.guild.members.cache.random();
		const TinderSlogan = ["Match?","Chat?","Date?","Flirt?"];
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
						const Nhasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10); // Updates leftover likes/rolls in real-time /s
						switch(reaction.emoji.name) { 
							case "❌": {
								Tinder.push(`dislikeID.${message.author.id}`, RandomUsr.id);
								const NewRollsLikes = Nhasrolls + " rolls " + haslikes + " likes remaining.";
								SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								const nwmbed = new Discord.MessageEmbed(EmbeDDD)
									.setAuthor("❌❌❌")	
									.setColor("#00FF00")
									.setTitle(RandomUsr.user.username)
									.setDescription("has been added to dislikes.")
									.setFooter(NewRollsLikes);
								return SentMsg.edit(nwmbed);
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
										.setAuthor("❤️🌟❤️")
										.setColor("#FFFF00")
										.setTitle(RandomUsr.user.username)
										.setDescription("Is now dating you!")
										.setFooter("You have no rolls or likes remaining.");
									return SentMsg.edit(nwmbed);
								}
								else {
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("You don't have any more likes!").then(msg => {
										msg.react("⚠️");
									});
								}
							}
							case "💚": {
								if (haslikes > 0) {	
									Tinder.subtract(`likes.${message.author.id}`, 1);
									const Nhaslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10); // Updates leftover likes/rolls in real-time /s
									const NewRollsLikes = Nhasrolls + " rolls " + Nhaslikes + " likes remaining."; 
									if (Tinder.has(`likeID.${RandomUsr.id}`)) { // Prevents choke
										const checklikeID = Tinder.get(`likeID.${RandomUsr.id}`); // Theoretically this part should work 
										if  (checklikeID.includes(`${message.author.id}`)) {
											Tinder.push(`dating.${message.author.id}`, RandomUsr.id);
											Tinder.push(`dating.${RandomUsr.id}`, message.author.id);
											SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
											const nwmbed = new Discord.MessageEmbed(EmbeDDD)
												.setAuthor("❤️❤️❤️")
												.setColor("#ff00ff")
												.setTitle(RandomUsr.user.username)
												.setDescription("It's a match! Congratulations!")
												.setFooter(NewRollsLikes);
											return SentMsg.edit(nwmbed);
										}
									}
									Tinder.push(`likeID.${message.author.id}`, RandomUsr.id);
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									const nwmbed = new Discord.MessageEmbed(EmbeDDD)
										.setAuthor("❤️❤️❤️")
										.setColor("#00FF00")
										.setTitle(RandomUsr.user.username)
										.setDescription("has been added to likes!")
										.setFooter(NewRollsLikes);
									SentMsg.edit(nwmbed);
								}
								else {
									SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
									return message.channel.send("You don't have any more likes!").then(msg => {
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
		// Functions
		function list() {
			message.channel.startTyping();
			const listembed = new Discord.MessageEmbed()
				.setTitle("Your tinder list");
			const LlikesID = Tinder.get(`likeID.${message.author.id}`);
			const LdislikeID = Tinder.get(`dislikeID.${message.author.id}`);	
			const Lmarried = Tinder.get(`married.${message.author.id}`);

			let datalikesID = "";
			let datadislikeID = "";
			let datamarried = "";

			for (const [i, value] of LlikesID.entries()) { // Yes rjt, I could just use a map instead
				const Member = message.guild.members.cache.get(value);
				const indexplus = i+1;
				datalikesID += indexplus+" "+Member.user.username+"\n";
			}
			for (const [i, value] of LdislikeID.entries()) {	// Maybe I got lost along the way
				const Member = message.guild.members.cache.get(value);
				const indexplus = i+1;
				datadislikeID += indexplus+" "+Member.user.username+"\n";
			}
			for (const [i, value] of Lmarried.entries()) { // Without a map...
				const Member = message.guild.members.cache.get(value);
				const indexplus = i+1;
				datamarried += indexplus+" "+Member.user.username+"\n";
			}
			listembed.addFields(
				{ name: "Likes", value: datalikesID, inline: true, },
				{ name: "Dislikes", value: datadislikeID, inline: true, },
				{ name: "Married", value: datamarried, inline: true, },
			);
			message.channel.send(listembed);
			return message.channel.stopTyping(true);
		}
	},
};