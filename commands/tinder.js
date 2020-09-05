const Discord = require("discord.js");
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { prefix, ownerID } = require("../config");
const { ResetRolls, timeToMidnight, msToTime, CommandUsage, ParseUserObject } = require("../functions/functions.js");
const { TinderStartup, TinderDBService, NoLikes, NoRolls, SeparateTinderList, fetchUserList } = require("../functions/tinder.js");
const embeds = require("../functions/embeds.js");
// tinderNodeCanvasImage
module.exports = {
	name: "tinder",
	cooldown: 1,
	aliases: ["t"],
	description: "Suggests someone to date",
	args: false,
	usage: "help",
	cmdCategory: "Fun",
	async execute(message, args) {

		const color = message.member.displayColor;
		if (!Tinder.has(`rolls.${message.author.id}`)) {
			// So the db/Tinder doesnt choke later...
			await TinderDBService(message.author);
		}
		const hasRolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
		const hasLikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		const RollsLikes = (hasRolls - 1) + " rolls " + hasLikes + " likes remaining.";
		const tinderCardUser = ParseUserObject(message, args);
		if (tinderCardUser && !args[1]) {
			return message.channel.send(embeds.tinderRollEmbed(message, tinderCardUser));
			// return tinderNodeCanvasImage(message, tinderCardUser);
		}
		switch (args[0]) {
			case "reset": {
				if (message.member.id === ownerID) {
					await ResetRolls();
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
					if (message.member.id === ownerID) { return TinderStartup(message); }
					// Shouldn't be necessary anymore, but ill leave it in // Maybe change to bot owner only as well // Added as of 1.3.2
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

		const userIDArray = await message.client.users.cache.map(user => !user.bot ? user.id : message.member.id),
			// This is how I filter out bot users. Please let me know if it can be done better
			filtered = userIDArray.filter(f => !combined.includes(f));
		if (!filtered.length) {
			// When there are no more people left
			return message.channel.send("Looking for people to date... 📡").then(sentMsg => {
				setTimeout(() => {
					(sentMsg.edit(sentMsg.content + "\nNo new potential mates were found."));
				}, 5000);
			});
		}
		const randomUserID = filtered[Math.floor(Math.random() * filtered.length)];
		const randomUsr = await message.client.users.cache.get(randomUserID);

		if (hasRolls > 0) {
			Tinder.subtract(`rolls.${message.author.id}`, 1);
			const randomUserEmbed = embeds.tinderRollEmbed(message, randomUsr, RollsLikes);
			message.channel.send(randomUserEmbed).then(SentMsg => {
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
						const newHasRolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
						// Updates leftover likes/rolls in real-time /s
						switch (reaction.emoji.name) {
							case "❌": { return Dislike(SentMsg, randomUserEmbed, newHasRolls); }
							case "🌟": { return SuperLike(SentMsg, randomUserEmbed); }
							case "💚": { return NormalLike(SentMsg, randomUserEmbed, newHasRolls); }
						}
					})
					.catch(() => {
						SentMsg.edit(new Discord.MessageEmbed(randomUserEmbed)
							.setFooter("Timed out"));
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
			const listEmbed = new Discord.MessageEmbed()
				.setTitle("Your tinder list")
				.setColor(color)
				.setFooter(`See specific lists with \`${prefix}tinder list likes | dislikes | dates | spouses\`
				`);
			const ListOfLikesID = [...new Set(Tinder.get(`likeID.${message.author.id}`))];
			const ListOfDislikeID = [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
			const ListOfDating = [...new Set(Tinder.get(`dating.${message.author.id}`))];
			const ListOfMarried = [...new Set(Tinder.get(`married.${message.author.id}`))];

			function allListMap(DataAndID) {
				return DataAndID.slice(1, 21).map((item, i) => `${+i + 1}. ${message.client.users.cache.find(user => user.id === item) ? message.client.users.cache.find(user => user.id === item).username : "User left guild"}`).join("\n");
			}
			listEmbed.addFields(
				{ name: "Likes", value: ListOfLikesID.slice(1).length ? allListMap(ListOfLikesID).substring(0, 660) : "N/A", inline: true },
				{ name: "Dislikes", value: ListOfDislikeID.slice(1).length ? allListMap(ListOfDislikeID).substring(0, 660) : "N/A", inline: true },
				{ name: "Dating", value: ListOfDating.slice(1).length ? allListMap(ListOfDating).substring(0, 660) : "N/A", inline: true });
			if (ListOfMarried.slice(1).length) {
				listEmbed.addFields(
					{ name: "\u200B", value: "\u200B", inline: true },
					{ name: "Married", value: allListMap(ListOfMarried).substring(0, 660) + "\u200B", inline: true },
					{ name: "\u200B", value: "\u200B", inline: true },
				);
			}
			message.channel.send(listEmbed);
		}
		function SuperLike(SentMsg, genericEmbed) {
			if (hasLikes > 0) {
				const zero = parseInt(0, 10);
				TinderDBService(randomUsr);
				Tinder.push(`dating.${message.author.id}`, randomUsr.id);
				Tinder.push(`dating.${randomUsr.id}`, message.author.id);
				Tinder.set(`rolls.${message.author.id}`, zero);
				Tinder.set(`likes.${message.author.id}`, zero);
				SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
				const newEmbed = new Discord.MessageEmbed(genericEmbed)
					.setAuthor("❤️🌟❤️")
					.setColor("#FFFF00")
					.setTitle(randomUsr.username)
					.setDescription("Is now dating you!")
					.setFooter("You have no rolls or likes remaining.");
				return SentMsg.edit(newEmbed);
			}
			else {
				SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
				return message.channel.send(NoLikes()).then(msg => {
					msg.react("⚠️");
				});
			}
		}
		function NormalLike(SentMsg, genericEmbed, newHasRolls) {
			if (hasLikes > 0) {
				Tinder.subtract(`likes.${message.author.id}`, 1);
				const newHasLikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
				// Updates leftover likes/rolls in real-time /s
				const NewRollsLikes = newHasRolls + " rolls " + newHasLikes + " likes remaining.";
				if (Tinder.has(`likeID.${randomUsr.id}`)) {
					// Prevents choke
					const checkLikeIDs = Tinder.get(`likeID.${randomUsr.id}`);
					// Theoretically this part should work
					if (checkLikeIDs.includes(`${message.author.id}`)) {
						Tinder.push(`dating.${message.author.id}`, randomUsr.id);
						Tinder.push(`dating.${randomUsr.id}`, message.author.id);
						SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
						const newEmbed = new Discord.MessageEmbed(genericEmbed)
							.setAuthor("❤️❤️❤️")
							.setColor("#ff00ff")
							.setTitle(randomUsr.user.username)
							.setDescription("It's a match! Congratulations!")
							.setFooter(NewRollsLikes);
						return SentMsg.edit(newEmbed);
					}
				}
				TinderDBService(randomUsr);
				Tinder.push(`likeID.${message.author.id}`, randomUsr.id);
				SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
				const newEmbed = new Discord.MessageEmbed(genericEmbed)
					.setAuthor("❤️❤️❤️")
					.setColor("#00FF00")
					.setTitle(randomUsr.username)
					.setDescription("has been added to likes!")
					.setFooter(NewRollsLikes);
				SentMsg.edit(newEmbed);
			}
			else {
				SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
				return message.channel.send(NoLikes()).then(msg => {
					msg.react("⚠️");
				});
			}
		}
		function Dislike(SentMsg, genericEmbed, newHasRolls) {
			Tinder.push(`dislikeID.${message.author.id}`, randomUsr.id);
			const NewRollsLikes = newHasRolls + " rolls " + hasLikes + " likes remaining.";
			SentMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
			const newEmbed = new Discord.MessageEmbed(genericEmbed)
				.setAuthor("❌❌❌")
				.setColor("#00FF00")
				.setTitle(randomUsr.username)
				.setDescription("has been added to dislikes.")
				.setFooter(NewRollsLikes);
			return SentMsg.edit(newEmbed);
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
			if (!DLikes) {
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