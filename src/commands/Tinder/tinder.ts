import db from "quick.db";
const Tinder = new db.table("Tinder");
import { NoRolls, Dislike, SuperLike, NormalLike, tinderDataStructure, tinderDBService } from "../../nsb/Tinder";
import { tinderRollEmbed } from "../../nsb/Embeds";
import { Command, Argument, Flag } from "@cataclym/discord-akairo";
import { MessageEmbed, Message, User, MessageReaction } from "discord.js";
import { config } from "../../config";

const reactPromises = async (SentMsg: Message) => {
	await SentMsg.react("❌");
	setTimeout(async () => await SentMsg.react("💚"), 750);
	setTimeout(async () => await SentMsg.react("🌟"), 1500);
};

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

		await tinderDBService(args ?? message.author);

		if (args) {
			return message.channel.send(await tinderRollEmbed(message, args));
		}

		const tinderUserData: tinderDataStructure = Tinder.get(message.author.id),
			{ datingIDs, marriedIDs, likeIDs, likes, dislikeIDs, temporary } = tinderUserData;
		let { rolls } = tinderUserData;

		const combined: string[] = ([] as string[]).concat(likeIDs, dislikeIDs, marriedIDs, datingIDs, temporary);
		const RollsLikes = (rolls - 1) + " rolls " + likes + " likes remaining.";

		const userIDArray = message.client.users.cache.map(user => !user.bot ? user.id : message.member?.id),
			// This is how I filter out bot users. Please let me know if it can be done better
			filtered = userIDArray.filter((f: string) => !combined.includes(f));

		if (!filtered.length) {
			// When there are no more people left
			return message.channel.send("Looking for people to date... 📡").then((sentMsg) => {
				setTimeout(async () => {
					(sentMsg.edit(sentMsg.content + "\nNo new potential mates were found."));
				}, 5000);
			});
		}

		const randomUserID = filtered[Math.floor(Math.random() * filtered.length)];
		const randomUsr = message.client.users.cache.get(randomUserID ?? config.ownerID);

		if (rolls > 0 && randomUsr) {
			--rolls;
			temporary.push(randomUsr.id);

			console.log(rolls);

			Tinder.set(message.author.id, { datingIDs, marriedIDs, likeIDs, likes, dislikeIDs, rolls, temporary });

			await tinderDBService(randomUsr);

			const SentMsg = await message.channel.send(await tinderRollEmbed(message, randomUsr, RollsLikes));
			reactPromises(SentMsg)
				.catch(err => console.log(err));
			const filter = async (reaction: MessageReaction, user: User) => {
				return ["❌", "💚", "🌟"].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			SentMsg.awaitReactions(filter, { max: 1, time: 25000, errors: ["time"] })
				.then(async (collected) => {
					switch (collected.first()?.emoji.name) {
						case "❌": {
							return Dislike(message, SentMsg, SentMsg.embeds[0], rolls, likes, randomUsr);
						}
						case "🌟": {
							return SuperLike(message, SentMsg, SentMsg.embeds[0], likes, randomUsr);
						}
						case "💚": {
							return NormalLike(message, SentMsg, SentMsg.embeds[0], rolls, likes, randomUsr);
						}
					}
				})
				.catch(async () => {
					SentMsg.edit(new MessageEmbed(SentMsg.embeds[0]).setFooter("Timed out")).then(msg => msg.reactions.removeAll());
				});
		}
		else {
			return message.reply(await NoRolls());
		}
	}
}