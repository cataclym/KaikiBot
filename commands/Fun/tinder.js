const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { NoRolls, Dislike, SuperLike, NormalLike } = require("../../functions/tinder.js");
const embeds = require("../../functions/embeds.js");
const { Command, Argument, Flag } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const reactPromises = async (SentMsg) => {
	SentMsg.react("❌");
	SentMsg.react("💚");
	SentMsg.react("🌟");
};

// tinderNodeCanvasImage
module.exports = class TinderMain extends Command {
	constructor() {
		super("tinder", {
			name: "tinder",
			cooldown: 2,
			aliases: ["t", "tinder"],
			description: { description: "Suggests someone to date", usage: "help" },
		});
	}
	*args() {
		const method = yield {
			type: [
				["tinderlist", "list"],
				["tinderremove", "remove", "rem", "rm"],
				["marry"],
				["tinderhelp", "help"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
		const user = yield {
			type: "user",
			flag: ["u", "-u"],
		};
		return user;
	}
	async exec(message, args) {

		if (args) {
			return message.util.send(await embeds.tinderRollEmbed(message, args));
			// return tinderNodeCanvasImage(message, tinderCardUser);
		}
		const hasRolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
		const hasLikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		const RollsLikes = (hasRolls - 1) + " rolls " + hasLikes + " likes remaining.";
		const rolledIDs = Tinder.get(`temporary.${message.author.id}`);
		const likesID = Tinder.get(`likeID.${message.author.id}`);
		const dislikeID = Tinder.get(`dislikeID.${message.author.id}`);
		const dating = Tinder.get(`dating.${message.author.id}`);
		const married = Tinder.get(`married.${message.author.id}`);
		const combined = [].concat(likesID, dislikeID, married, dating, rolledIDs);

		const userIDArray = await message.client.users.cache.map(user => !user.bot ? user.id : message.member.id),
			// This is how I filter out bot users. Please let me know if it can be done better
			filtered = userIDArray.filter(f => !combined.includes(f));
		if (!filtered.length) {
			// When there are no more people left
			return message.util.send("Looking for people to date... 📡").then((sentMsg) => {
				setTimeout(async () => {
					(sentMsg.edit(sentMsg.content + "\nNo new potential mates were found."));
				}, 5000);
			});
		}
		const randomUserID = filtered[Math.floor(Math.random() * filtered.length)];
		const randomUsr = await message.client.users.cache.get(randomUserID);

		if (hasRolls > 0) {
			Tinder.subtract(`rolls.${message.author.id}`, 1);
			Tinder.push(`temporary.${message.author.id}`, randomUserID);
			const randomUserEmbed = await embeds.tinderRollEmbed(message, randomUsr, RollsLikes);
			const SentMsg = await message.util.send(randomUserEmbed);
			reactPromises(SentMsg)
				.catch(err => console.log(err));
			const filter = async (reaction, user) => {
				return ["❌", "💚", "🌟"].includes(reaction.emoji.name) && user.id === message.author.id;
			};
			SentMsg.awaitReactions(filter, { max: 1, time: 25000, errors: ["time"] })
				.then(async (collected) => {
					const reaction = collected.first();
					const newHasRolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
					// Updates leftover likes/rolls in real-time /s
					switch (reaction.emoji.name) {
						case "❌": {
							return Dislike(message, SentMsg, randomUserEmbed, newHasRolls, hasLikes, randomUsr);
						}
						case "🌟": {
							return SuperLike(message, SentMsg, randomUserEmbed, hasLikes, randomUsr);
						}
						case "💚": {
							return NormalLike(message, SentMsg, randomUserEmbed, newHasRolls, hasLikes, randomUsr);
						}
					}
				}).catch(async () => SentMsg.edit(new MessageEmbed(randomUserEmbed).setFooter("Timed out")).then(msg => msg.reactions.removeAll()));
		}
		else {
			return message.reply(NoRolls());
		}
	}
};