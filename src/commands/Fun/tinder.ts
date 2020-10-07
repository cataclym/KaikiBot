import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { NoRolls, Dislike, SuperLike, NormalLike } from "../../functions/tinder";
import { tinderRollEmbed } from "../../functions/embeds";
import { Command, Argument, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message, User, MessageReaction } from "discord.js";
import { ownerID } from "../../config";

const reactPromises = async (SentMsg: Message) => {
	SentMsg.react("❌");
	SentMsg.react("💚");
	SentMsg.react("🌟");
};

// tinderNodeCanvasImage
module.exports = class TinderMain extends Command {
	constructor() {
		super("tinder", {
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
	async exec(message: Message, args: any) {

		if (args) {
			return message.util?.send(await tinderRollEmbed(message, args));
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
		const combined: string[] = [].concat(likesID, dislikeID, married, dating, rolledIDs);

		const userIDArray = message.client.users.cache.map(user => !user.bot ? user.id : message.member?.id),
			// This is how I filter out bot users. Please let me know if it can be done better
			filtered = userIDArray.filter((f: string) => !combined.includes(f));
		if (!filtered.length) {
			// When there are no more people left
			return message.util?.send("Looking for people to date... 📡").then((sentMsg) => {
				setTimeout(async () => {
					(sentMsg.edit(sentMsg.content + "\nNo new potential mates were found."));
				}, 5000);
			});
		}
		const randomUserID = filtered[Math.floor(Math.random() * filtered.length)];
		const randomUsr = message.client.users.cache.get(randomUserID ? randomUserID : ownerID);

		if (hasRolls > 0 && randomUsr) {
			Tinder.subtract(`rolls.${message.author.id}`, 1);
			Tinder.push(`temporary.${message.author.id}`, randomUserID);
			console.log(await tinderRollEmbed(message, randomUsr, RollsLikes));

			const randomUserEmbed = await tinderRollEmbed(message, randomUsr, RollsLikes);
			const SentMsg = await message.channel.send(randomUserEmbed);
			reactPromises(SentMsg)
				.catch(err => console.log(err));
			const filter = async (reaction: MessageReaction, user: User) => {
				return ["❌", "💚", "🌟"].includes(reaction.emoji.name) && user.id === message.author.id;
			};
			SentMsg.awaitReactions(filter, { max: 1, time: 25000, errors: ["time"] })
				.then(async (collected) => {
					const reaction = collected.first();
					const newHasRolls = parseInt(Tinder.get(`rolls.${message.author.id}`), 10);
					// Updates leftover likes/rolls in real-time /s
					switch (reaction?.emoji.name) {
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
			return message.reply(await NoRolls());
		}
	}
};