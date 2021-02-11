import { Command } from "@cataclym/discord-akairo";
import { DMEMarry } from "../../nsb/Embeds.js";
import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { getTinderDB } from "../../struct/db.js";

module.exports = class TinderMarryCommand extends Command {
	constructor() {
		super("marry", {
			args: [
				{
					id: "user",
					type: "user",
					otherwise: (m: Message) => new MessageEmbed()
						.setDescription("Provide a user you wish you wish to marry.")
						.withErrorColor(m),
					// TODO: prompt:
				},
			],
		});
	}
	public async exec(message: Message, { user }: { user: User}) {
		const db = await getTinderDB(user.id),
			ArgDates = db.tinderData.datingIDs;

		if (ArgDates.includes(message.author.id)) {

			const authorDB = await getTinderDB(message.author.id),
				MarryMatches = authorDB.tinderData.marriedIDs.filter((f: string) => db.tinderData.marriedIDs.includes(f));

			if (!MarryMatches.includes(user.id)) {
				message.channel.send(`Do you want to marry ${message.author.username}, <@${user.id}>?\nReact with a ❤️ to marry!`)
					.then(msg => {
						msg.react("❤️");

						const filter = (reaction: MessageReaction, reactionUser: User) => {
							return reaction.emoji.name === "❤️" && reactionUser.id === user.id;
						};

						msg.awaitReactions(filter, { max: 1, time: 50000, errors: ["time"] })
							.then(async () => {
								authorDB.tinderData.marriedIDs.push(user.id);
								db.tinderData.marriedIDs.push(message.author.id);
								return message.channel.send(await DMEMarry());
							})
							.catch(async () => {
								msg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return msg.edit("Timed out");
							});
					});
			}
			else { return message.util?.send("You can't marry this person!"); }
		}
		else { return message.util?.send("You are not dating this person!"); }
	}
};