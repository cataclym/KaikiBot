const Discord = require("discord.js");
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { getUserFromMention, ResetRolls, timeToMidnight, msToTime } = require("../functions/functions.js");
const embeds = require("../functions/embeds.js");
const { TinderStartup, TinderDBService, NoLikes, NoRolls } = require("../functions/tinder.js");
const { poems } = require("../functions/poems.js");
const Rpoem = poems[Math.floor(Math.random() * poems.length)];

module.exports = {
	name: "tinder",
	cooldown: 2,
	aliases: ["date","lfd","ons"],
	description: "Suggests someone to date",
	args: false,
	usage: "help",
	async execute(message, args) {

		if (!Tinder.has(`rolls.${message.author.id}`)) { // So the db/Tinder doesnt choke later...
			TinderDBService(message.author);
		}
		switch (args[0]) { 
			case "reset": {
				try { if (message.member.hasPermission("ADMINISTRATOR")) {
					ResetRolls(message);
					return message.react("✅"); }
				else { return message.channel.send("You do not have sufficient permissions."); }
				}
				catch (error) { return console.log("Error :", error); }
			}
			case "list": { return list();
			}
			case "marry": { return marry();
			}
			case "help": { 
				embeds.TinderHelp.fields[3] = { name: "Reset", value: "Rolls and likes reset every day. Currently resets in: " + msToTime(timeToMidnight()), inline: true };
				return message.channel.send(embeds.TinderHelp);
			}
			case "test": { // remove
				try { if (message.member.hasPermission("ADMINISTRATOR")) { return; }
				////embeds.DMEMarry.setDescription(Rpoem);
				////return message.channel.send(embeds.DMEMarry);
				else { return message.channel.send("You do not have sufficient permissions."); }
				}
				catch (error) { return console.log("Error :", error); }
			}
			case "start": {
				try { if (message.member.hasPermission("ADMINISTRATOR")) { return TinderStartup(message); } // Shouldnt be necessary anymore, but ill leave it in // Maybe change to bot owner only as well
				}
				catch (error) { return console.log("Error :", error); }
			}
		}
			
		const likesID = Tinder.get(`likeID.${message.author.id}`);
		const dislikeID = Tinder.get(`dislikeID.${message.author.id}`);
		const dating = 	Tinder.get(`dating.${message.author.id}`);
		const married = Tinder.get(`married.${message.author.id}`);
		const combined = new Array().concat(likesID, dislikeID, married, dating);

		const arr = await message.guild.members.cache.map(member => member.id),
			res = arr.filter(f => !combined.includes(f));
		if (!res.length) { // When there are no more people left
			message.channel.send("Looking for people to date... 📡");
			setTimeout(() => { (message.channel.send("No new potential mates were found.")); }, 5000);
			return;
		}
		const randomUserID = res[Math.floor(Math.random() * res.length)];
		const RandomUsr = await message.guild.members.cache.get(randomUserID);

		const color = await message.member.displayColor;
		const TinderSlogan = ["Match?","Chat?","Date?","Flirt?"];
		const RandomTinderS = TinderSlogan[Math.floor(Math.random() * TinderSlogan.length)];
		const hasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);	
		const haslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		
		console.log(message.author.username + " has: Rolls left : " + hasrolls + ". Likes left : " + haslikes);
		const RollsLikes = (hasrolls - 1) + " rolls " + haslikes + " likes remaining.";
		
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
							case "❌": { return Dislike(SentMsg, EmbeDDD, Nhasrolls); }
							case "🌟": { return SuperLike(SentMsg, EmbeDDD); }
							case "💚": { return NormalLike(SentMsg, EmbeDDD, Nhasrolls); }
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
			message.reply(NoRolls()).then(msg => {
				msg.react("⚠️"); });
		}
		// Functions
		function list() {
			message.channel.startTyping();
			TinderDBService(message.author);
			const listembed = new Discord.MessageEmbed()
				.setTitle("Your tinder list");
			const LlikesID = Tinder.get(`likeID.${message.author.id}`);
			const LdislikeID = Tinder.get(`dislikeID.${message.author.id}`);
			const Ldating = Tinder.get(`dating.${message.author.id}`);		
			const Lmarried = Tinder.get(`married.${message.author.id}`);

			let datalikesID = "";
			let datadislikeID = "";
			let datadating = "";
			let datamarried = "";

			for (const [i, value] of LlikesID.entries()) { // Yes rjt, I could just use a map instead
				if (value !== message.author.id) {
					const Member = message.client.users.cache.find(member => member.id === value);
					const indexplus = i;
					datalikesID += indexplus + ". " + Member.username + "\n";
				}
				else { continue; }
			}
			for (const [i, value] of LdislikeID.entries()) { // Maybe I got lost along the way
				if (value !== message.author.id) {
					const Member = message.client.users.cache.find(member => member.id === value);
					const indexplus = i;
					datadislikeID += indexplus + ". " + Member.username + "\n";
				}
				else { continue; }
			}
			for (const [i, value] of Ldating.entries()) { // Maybe I got lost along the way (x2)
				if (value !== message.author.id) {
					const Member = message.client.users.cache.find(member => member.id === value);
					const indexplus = i;
					datadating += indexplus + ". " + Member.username + "\n";
				}
				else { continue; }
			}
			for (const [i, value] of Lmarried.entries()) { // Without a map...
				if (value !== message.author.id) {
					const Member = message.client.users.cache.find(member => member.id === value);
					const indexplus = i;
					datamarried += indexplus + ". " + Member.username + "\n";
				}
				else { continue; }
			}
			listembed.addFields( // Yeah I know, bad solution, but it doesnt look too bad on Discord.
				{ name: "Likes", value: datalikesID.substring(0, 1023) + "\u200B", inline: true, },
				{ name: "Dislikes", value: datadislikeID.substring(0, 1023) + "\u200B", inline: true, },
				{ name: "Dating", value: datadating.substring(0, 1023) + "\u200B", inline: true, },
				{ name: "\u200B", value: "\u200B", inline: true, },
				{ name: "Married", value: datamarried.substring(0, 1023) + "\u200B", inline: true, },
				{ name: "\u200B", value: "\u200B", inline: true, },
			);
			message.channel.send(listembed);
			return message.channel.stopTyping(true);
		}
		function SuperLike(SentMsg, EmbeDDD) {
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
				return message.channel.send(NoLikes()).then(msg => {
					msg.react("⚠️"); });
			}
		}
		function NormalLike(SentMsg, EmbeDDD, Nhasrolls) {
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
				TinderDBService(RandomUsr);
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
				return message.channel.send(NoLikes()).then(msg => {
					msg.react("⚠️"); });
			}
		}
		function Dislike(SentMsg, EmbeDDD, Nhasrolls) {
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
		function marry() {
			const user = getUserFromMention(args[1], message);
			if (user) {
				const ArgDates = Tinder.get(`dating.${message.mentions.users.first().id}`);
				const AuthorDates = Tinder.get(`dating.${message.author.id}`),
					matches = AuthorDates.filter(f => ArgDates.includes(f));
				if (matches.includes(message.mentions.users.first().id)) {
					const ArgMarry = Tinder.get(`married.${message.mentions.users.first().id}`);
					const AuthorMarry = Tinder.get(`married.${message.author.id}`),
						MarryMatches = AuthorMarry.filter(f => ArgMarry.includes(f));
					if (!MarryMatches.includes(message.mentions.users.first().id)) {
						message.channel.send("Do you want to marry " + message.author.username + `, <@${message.mentions.users.first().id}>?` + "\nReact with a `❤️` to marry!" )
							.then(heart => {
								heart.react("❤️");
								const filter = (reaction, user) => {
									return reaction.emoji.name === "❤️" && user.id === message.mentions.users.first().id;
								};
								heart.awaitReactions(filter, { max: 1, time: 50000, errors: ["time"] })
									.then(collected => {
										Tinder.push(`married.${message.author.id}`, message.mentions.users.first().id);
										Tinder.push(`married.${message.mentions.users.first().id}`, message.author.id);
										embeds.DMEMarry.setDescription(Rpoem);
										return message.channel.send(embeds.DMEMarry);
									})
									.catch(collected => {
										heart.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
										return heart.edit("Timed out");
									}); });
					}
					else { message.channel.send("Not allowed to marry this person!"); }
				}
				else { message.channel.send("You are not dating this person!"); }
			}
			else { message.channel.send("Please mention a user!"); }
		}
	},
};