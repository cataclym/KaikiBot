const Discord = require("discord.js");
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { getUserFromMention, ResetRolls, timeToMidnight, msToTime, CommandUsage } = require("../functions/functions.js");
const embeds = require("../functions/embeds.js");
const { prefix } = require("../config");
const { TinderStartup, TinderDBService, NoLikes, NoRolls, SeparateTinderList } = require("../functions/tinder.js");

module.exports = {
	name: "tinder",
	cooldown: 2,
	aliases: ["date","lfd","ons", "t"],
	description: "Suggests someone to date",
	args: false,
	usage: "help",
	async execute(message, args) {

		if (!Tinder.has(`rolls.${message.author.id}`)) { // So the db/Tinder doesnt choke later...
			TinderDBService(message.author);
		}
		switch (args[0]) { 
			case "reset": {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					ResetRolls(message);
					return message.react("✅"); 
				}
				else { 
					return message.channel.send("You do not have sufficient permissions."); 
				}
			}
			case "list": 
				{ 
					if (!args[1]) {
						return list();
					}
					else {
						switch (args[1])
						{
							case "l":
							case "likes": {
								const likesID = [...new Set(Tinder.get(`likeID.${message.author.id}`))];
								return SeparateTinderList(message, likesID);
							}
							case "dl":
							case "dislikes": {
								const dislikeID = [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
								return SeparateTinderList(message, dislikeID);
							}
							case "dating":
							case "d":
							case "dates": {
								const dating = 	[...new Set(Tinder.get(`dating.${message.author.id}`))];
								return SeparateTinderList(message, dating);
							}
							case "married":
							case "marries":
							case "s":
							case "spouses": {
								const married = [...new Set(Tinder.get(`married.${message.author.id}`))];
								return SeparateTinderList(message, married);
							}
							default: {
								return list();
							}
						}
					}
				}
			case "marry":
				{
					return marry();
				}
			case "help":
				{ 
				embeds.TinderHelp.fields[4] = { name: "Reset", value: "Rolls and likes reset every day. Currently resets in: " + msToTime(timeToMidnight()), inline: false };
				return message.channel.send(embeds.TinderHelp);
				}
			case "del":
			case "delete":
			case "rem":
			case "remove": 
				{
					return  RemoveEntryFromList();
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
		const combined = [].concat(likesID, dislikeID, married, dating);

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
			TinderDBService(message.author);
			const listembed = new Discord.MessageEmbed()
				.setTitle("Your tinder list")
				.setFooter(`See specific lists with \`${prefix}tinder list likes | dislikes | dates | spouses\`
				`);
			const LlikesID = [...new Set(Tinder.get(`likeID.${message.author.id}`))];
			const LdislikeID = [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
			const Ldating = [...new Set(Tinder.get(`dating.${message.author.id}`))];		
			const Lmarried = [...new Set(Tinder.get(`married.${message.author.id}`))];

			const datalikesID = LlikesID.slice(1,21).map((item, i) => `${+i+1}. ${message.client.users.cache.find(member => member.id === item)?.username}`).join("\n");
			const datadislikeID = LdislikeID.slice(1,21).map((item, i) => `${+i+1}. ${message.client.users.cache.find(member => member.id === item)?.username}`).join("\n");
			const datadating = Ldating.slice(1,21).map((item, i) => `${+i+1}. ${message.client.users.cache.find(member => member.id === item)?.username}`).join("\n");
			const datamarried = Lmarried.slice(1,21).map((item, i) => `${+i+1}. ${message.client.users.cache.find(member => member.id === item)?.username}`).join("\n");
			
			listembed.addFields( // Yeah I know, bad solution, but it doesnt look too bad on Discord.
				{ name: "Likes", value: datalikesID.substring(0, 660) + "\u200B", inline: true, },
				{ name: "Dislikes", value: datadislikeID.substring(0, 660) + "\u200B", inline: true, },
				{ name: "Dating", value: datadating.substring(0, 660) + "\u200B", inline: true, },
				{ name: "\u200B", value: "\u200B", inline: true, },
				{ name: "Married", value: datamarried.substring(0, 660) + "\u200B", inline: true, },
				{ name: "\u200B", value: "\u200B", inline: true, },
			);
			message.channel.send(listembed);
		}
		function SuperLike(SentMsg, EmbeDDD) {
			if (haslikes > 0) {
				const zero = parseInt(0, 10);
				TinderDBService(RandomUsr);
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
				if (ArgDates.includes(`${message.author.id}`))  {
					const ArgMarry = Tinder.get(`married.${message.mentions.users.first().id}`);
					const AuthorMarry = Tinder.get(`married.${message.author.id}`),
						MarryMatches = AuthorMarry.filter(f => ArgMarry.includes(f));
					if (!MarryMatches.includes(`${message.mentions.users.first().id}`)) {
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
										return message.channel.send(embeds.DMEMarry());
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
		function RemoveEntryFromList()
		{
			const DLikes = [...new Set(Tinder.fetch(`dislikeID.${message.author.id}`))];
			if (DLikes === null)
			{	// Likely won't happen
				return message.channel.send("Nothing to delete.");
			}
			const CombinedDLikes = DLikes.map(a => a);
			const ThisCommand = message.client.commands.get("tinder");
			if (args[1]) {
				const index = parseInt(args[1], 10); // Matches given number to array item
				const removedItem = CombinedDLikes.splice(index, 1);
				if (!(removedItem.toString() === message.author.id || isNaN(index))) {
					Tinder.set(`dislikeID.${message.author.id}`, CombinedDLikes);
					const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46); // Returns removedItem with space
					return message.channel.send(`Removed \`${stringified}\` from list.`).then(SentMsg => {
						SentMsg.react("✅");
					});
				}
				else {
					return CommandUsage(message, ThisCommand)
				}
			}
			else {
				return CommandUsage(message, ThisCommand)
			}
		}
	},
};