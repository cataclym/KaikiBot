import { Argument, Command, Flag } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import logger from "loglevel";
import { tinderRollEmbed } from "../../lib/Embeds";
import { noMoreLikesOrRolls, tinderDislike, tinderNormalLike, tinderSuperLike } from "../../lib/Tinder";
import { getTinderDocument } from "../../struct/documentMethods";

const reactPromises = async (SentMsg: Message) => {
	await SentMsg.react("❌");
	setTimeout(async () => await SentMsg.react("💚"), 750);
	setTimeout(async () => await SentMsg.react("🌟"), 1500);
};

export let rollsCache: {[authorID: string]: number} = {};

export async function clearRollCache(): Promise<void> {
	rollsCache = {};
}

// tinderNodeCanvasImage
export default class TinderMain extends Command {
	constructor() {
		super("tinder", {
			cooldown: 6500,
			ratelimit: 2,
			aliases: ["t", "tinder"],
			description: { description: "Suggests someone to date", usage: "help" },
		});
	}
	*args(): unknown {
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
			Math: "content",
			flag: ["u", "-u", "--user"],
		};
		return user;
	}
	public async exec(message: Message, args: User | undefined): Promise<Message | void> {

		if (args) {
			return message.channel.send(await tinderRollEmbed(message, args));
		}

		const tinderUserData = await getTinderDocument(message.author.id),
			{ datingIDs, marriedIDs, likeIDs, likes, dislikeIDs, temporary } = tinderUserData;
		let rolls = rollsCache[message.author.id];

		if (!rolls) {
			rolls = tinderUserData.rolls;
		}


		const combined = ([] as string[]).concat(likeIDs, dislikeIDs, marriedIDs, datingIDs, temporary);
		const RollsLikes = (rolls - 1) + " rolls " + likes + " likes remaining.";

		const userIDArray = message.client.users.cache.map(user => !user.bot ? user.id : message.member?.id),
			// This is how I filter out bot users. Please let me know if it can be done better
			filtered = userIDArray.filter((f: Snowflake) => !combined.includes(f) && f !== message.author.id);

		if (!filtered.length) {
			// When there are no more people left
			return message.channel.send("Looking for people to date... 📡")
				.then((sentMsg) => {
					setTimeout(async () => {
						sentMsg.edit(sentMsg.content + "\nNo new potential mates were found.");
					}, 5000);
				});
		}

		const randomUserID = filtered[Math.floor(Math.random() * filtered.length)];

		if (rolls > 0 && randomUserID) {
			const randomUsr = message.client.users.cache.get(randomUserID);
			if (!randomUsr) return;
			--rolls;
			temporary.push(randomUsr.id);

			rollsCache[message.author.id] = rolls;
			tinderUserData.rolls = rolls;
			tinderUserData.markModified("rolls");

			const ramdomUsrData = await getTinderDocument(randomUsr.id),
				SentMsg = await message.channel.send(await tinderRollEmbed(message, randomUsr, RollsLikes));

			reactPromises(SentMsg)
				.catch(err => logger.error(err));

			const filter = async (reaction: MessageReaction, user: User) => {
				return ["❌", "💚", "🌟"].includes(reaction.emoji.name ?? reaction.emoji.identifier) && user.id === message.author.id;
			};

			SentMsg.awaitReactions(filter, { max: 1, time: 25000, errors: ["time"] })
				.then(async (collected) => {
					switch (collected.first()?.emoji.name) {
						case "❌": {
							return tinderDislike(message, SentMsg, SentMsg.embeds[0], randomUsr, tinderUserData, ramdomUsrData);
						}
						case "🌟": {
							return tinderSuperLike(message, SentMsg, SentMsg.embeds[0], randomUsr, tinderUserData, ramdomUsrData);
						}
						case "💚": {
							return tinderNormalLike(message, SentMsg, SentMsg.embeds[0], randomUsr, tinderUserData, ramdomUsrData);
						}
					}
				})
				.catch(async () => {
					SentMsg.edit(new MessageEmbed(SentMsg.embeds[0]).setFooter("Timed out"))
						.then(msg => msg.reactions.removeAll());
				});
		}
		else {
			return message.reply(await noMoreLikesOrRolls("rolls"));
		}
	}
}