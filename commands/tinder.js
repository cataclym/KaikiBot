const Discord = require("discord.js");
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { ResetRolls, timeToMidnight, msToTime, CommandUsage, ParseUserObject } = require("../functions/functions.js");
const embeds = require("../functions/embeds.js");
const { prefix } = require("../config");
const { TinderStartup, TinderDBService, NoLikes, NoRolls, SeparateTinderList, fetchUserList } = require("../functions/tinder.js");
const config = require("../config");
const { tinderRollEmbed } = require("../functions/embeds.js");

module.exports = {
	name: "tinder",
	cooldown: 1,
	aliases: ["date", "t"],
	description: "Suggests someone to date",
	args: false,
	usage: "help",
	cmdCategory: "Fun",
	async execute(message, args) {

		const color = await message.member.displayColor;
		if (!Tinder.has(`rolls.${message.author.id}`)) {
			// So the db/Tinder doesnt choke later...
			TinderDBService(message.author);
		}
		const hasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
		const haslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		const RollsLikes = (hasrolls - 1) + " rolls " + haslikes + " likes remaining.";
		const tinderCardUser = ParseUserObject(message, args);
		if (tinderCardUser) {
			return message.channel.send(tinderRollEmbed(message, tinderCardUser));
		}
		switch (args[0]) {
			case "reset": {
				if (message.member.id === config.ownerID) {
					ResetRolls();
					return message.react("✅");
				}
				else {
					return message.channel.send("Not bot owner.");
				}
			}
			case "list":
			{
				if (!args[1]) {
					return list();
				}
				else {
					const newArgs = args.slice(1);
					const listUser = ParseUserObject(message, newArgs);
					if (listUser) {
						return fetchUserList(message, listUser);
					}
					switch (args[1]) {
						case "l":
						case "like":
						case "likes": {
							const likesID = [...new Set(Tinder.get(`likeID.${message.author.id}`))];
							return SeparateTinderList(message, likesID);
						}
						case "dl":
						case "dislike":
						case "dislikes": {
							const dislikeID = [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
							return SeparateTinderList(message, dislikeID);
						}
						case "d":
						case "date":
						case "dates":
						case "dating": {
							const dating = 	[...new Set(Tinder.get(`dating.${message.author.id}`))];
							return SeparateTinderList(message, dating);
						}
						case "s":
						case "marry":
						case "married":
						case "marries":
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
				return RemoveEntryFromList();
			}
			case "start": {
				try {
					if (message.member.id === config.ownerID) { return TinderStartup(message); }
					// Shouldnt be necessary anymore, but ill leave it in // Maybe change to bot owner only as well // Added as of 1.3.2
					else {
						return message.channel.send("Not bot owner.");
					}
				}
				catch (error) {
					return console.log("Error :", error);
				}
			}
		}

		const likesID = Tinder.get(`likeID.${message.author.id}`);
		const dislikeID = Tinder.get(`dislikeID.${message.author.id}`);
		const dating = 	Tinder.get(`dating.${message.author.id}`);
		const married = Tinder.get(`married.${message.author.id}`);
		const combined = [].concat(likesID, dislikeID, married, dating);

		const userIDarray = await message.client.users.cache.map(user => !user.bot ? user.id : message.member.id),
			// This is how I filter out bot users. Please let me know if it can be done better
			filtered = userIDarray.filter(f => !combined.includes(f));
		if (!filtered.length) {
			// When there are no more people left
			return message.channel.send("Looking for people to date... 📡").then(sentMsg => {
				setTimeout(() => {
					(sentMsg.edit(sentMsg.content + "\nNo new potential mates were found."));
				}, 5000);
			});
		}
		const randomUserID = filtered[Math.floor(Math.random() * filtered.length)];
		const RandomUsr = await message.client.users.cache.get(randomUserID);

		if (hasrolls > 0) {
			Tinder.subtract(`rolls.${message.author.id}`, 1);
			message.channel.send(tinderRollEmbed(message, RandomUsr, RollsLikes)).then(SentMsg => {
				Promise.all([
					SentMsg.react("❌"),
					SentMsg.react("💚"),
					SentMsg.react("🌟"),
				])
					.catch(() => console.error("Error in tinder react"));

				const filter = (reaction, user) => {
					return ["❌", "💚", "🌟"].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				SentMsg.awaitReactions(filter, { max: 1, time: 25000, errors: ["time"] })
					.then(collected => {
						const reaction = collected.first();
						const Nhasrolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
						// Updates leftover likes/rolls in real-time /s
						switch (reaction.emoji.name) {
							case "❌": { return Dislike(SentMsg, tinderRollEmbed(message, RandomUsr, RollsLikes), Nhasrolls); }
							case "🌟": { return SuperLike(SentMsg, tinderRollEmbed(message, RandomUsr, RollsLikes)); }
							case "💚": { return NormalLike(SentMsg, tinderRollEmbed(message, RandomUsr, RollsLikes), Nhasrolls); }
						}
					})
					.catch(() => {
						const nwmbed = new Discord.MessageEmbed(tinderRollEmbed(message, RandomUsr, RollsLikes))
							.setFooter("Timed out");
						SentMsg.edit(nwmbed);
						SentMsg.reactions.removeAll();
					});
			});
		}
		else {
			message.reply(NoRolls()).then(msg => {
				msg.react("⚠️");
			});
		}
		// Functions
		function list() {
			TinderDBService(message.author);
			const listembed = new Discord.MessageEmbed()
				.setTitle("Your tinder list")
				.setColor(color)
				.setFooter(`See specific lists with \`${prefix}tinder list likes | dislikes | dates | spouses\`
				`);
			const LlikesID = [...new Set(Tinder.get(`likeID.${message.author.id}`))];
			const LdislikeID = [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
			const Ldating = [...new Set(Tinder.get(`dating.${message.author.id}`))];
			const Lmarried = [...new Set(Tinder.get(`married.${message.author.id}`))];

			function allListMap(DataAndID) {
				return DataAndID.slice(1, 21).map((item, i) => `${+i + 1}. ${message.client.users.cache.find(user => user.id === item) ? message.client.users.cache.find(user => user.id === item).username : "User left guild"}`).join("\n");
			}
			listembed.addFields(
				{ name: "Likes", value: LlikesID.slice(1).length ? allListMap(LlikesID).substring(0, 660) : "N/A", inline: true },
				{ name: "Dislikes", value: LdislikeID.slice(1).length ? allListMap(LdislikeID).substring(0, 660) : "N/A", inline: true },
				{ name: "Dating", value: Ldating.slice(1).length ? allListMap(Ldating).substring(0, 660) : "N/A", inline: true });
			if (Lmarried.slice(1).length) {
				listembed.addFields(
					{ name: "\u200B", value: "\u200B", inline: true },
					{ name: "Married", value: allListMap(Lmarried).substring(0, 660) + "\u200B", inline: true },
					{ name: "\u200B", value: "\u200B", inline: true },
				);
			}
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
					.setTitle(RandomUsr.username)
					.setDescription("Is now dating you!")
					.setFooter("You have no rolls or likes remaining.");
				return SentMsg.edit(nwmbed);
			}
			else {
				SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
				return message.channel.send(NoLikes()).then(msg => {
					msg.react("⚠️");
				});
			}
		}
		function NormalLike(SentMsg, EmbeDDD, Nhasrolls) {
			if (haslikes > 0) {
				Tinder.subtract(`likes.${message.author.id}`, 1);
				const Nhaslikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
				// Updates leftover likes/rolls in real-time /s
				const NewRollsLikes = Nhasrolls + " rolls " + Nhaslikes + " likes remaining.";
				if (Tinder.has(`likeID.${RandomUsr.id}`)) {
					// Prevents choke
					const checklikeID = Tinder.get(`likeID.${RandomUsr.id}`);
					// Theoretically this part should work
					if (checklikeID.includes(`${message.author.id}`)) {
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
					.setTitle(RandomUsr.username)
					.setDescription("has been added to likes!")
					.setFooter(NewRollsLikes);
				SentMsg.edit(nwmbed);
			}
			else {
				SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
				return message.channel.send(NoLikes()).then(msg => {
					msg.react("⚠️");
				});
			}
		}
		function Dislike(SentMsg, EmbeDDD, Nhasrolls) {
			Tinder.push(`dislikeID.${message.author.id}`, RandomUsr.id);
			const NewRollsLikes = Nhasrolls + " rolls " + haslikes + " likes remaining.";
			SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
			const nwmbed = new Discord.MessageEmbed(EmbeDDD)
				.setAuthor("❌❌❌")
				.setColor("#00FF00")
				.setTitle(RandomUsr.username)
				.setDescription("has been added to dislikes.")
				.setFooter(NewRollsLikes);
			return SentMsg.edit(nwmbed);
		}
		function marry() {
			args.shift();
			const dUser = ParseUserObject(message, args);
			if (dUser) {
				const ArgDates = Tinder.get(`dating.${dUser.id}`);
				if (ArgDates.includes(`${message.author.id}`)) {
					const ArgMarry = Tinder.get(`married.${dUser.id}`);
					const AuthorMarry = Tinder.get(`married.${message.author.id}`),
						MarryMatches = AuthorMarry.filter(f => ArgMarry.includes(f));
					if (!MarryMatches.includes(`${dUser.id}`)) {
						message.channel.send("Do you want to marry " + message.author.username + `, <@${dUser.id}>?` + "\nReact with a ❤️ to marry!")
							.then(heart => {
								heart.react("❤️");
								const filter = (reaction, user) => {
									return reaction.emoji.name === "❤️" && user.id === dUser.id;
								};
								heart.awaitReactions(filter, { max: 1, time: 50000, errors: ["time"] })
									.then(() => {
										Tinder.push(`married.${message.author.id}`, dUser.id);
										Tinder.push(`married.${dUser.id}`, message.author.id);
										return message.channel.send(embeds.DMEMarry());
									})
									.catch(() => {
										heart.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
										return heart.edit("Timed out");
									});
							});
					}
					else { message.channel.send("Not allowed to marry this person!"); }
				}
				else { message.channel.send("You are not dating this person!"); }
			}
			else { message.channel.send("Try marrying a valid member!"); }
		}
		function RemoveEntryFromList() {
			const DLikes = [...new Set(Tinder.fetch(`dislikeID.${message.author.id}`))];
			if (DLikes === null) {
				// Likely won't happen
				return message.channel.send("Nothing to delete.");
			}
			const CombinedDLikes = DLikes.map(a => a);
			const ThisCommand = message.client.commands.get("tinder");
			if (args[1]) {
				const index = parseInt(args[1], 10);
				// Matches given number to array item
				const removedItem = CombinedDLikes.splice(index, 1);
				if (!(removedItem.toString() === message.author.id)) {
					Tinder.set(`dislikeID.${message.author.id}`, CombinedDLikes);
					const RemovedMember = message.client.users.cache.get(removedItem.toString());
					return message.channel.send(`Removed \`${RemovedMember?.username}\` from list.`).then(SentMsg => {
						SentMsg.react("✅");
					});
				}
				else {
					return CommandUsage(message, ThisCommand);
				}
			}
			else {
				return CommandUsage(message, ThisCommand);
			}
		}
	},
};