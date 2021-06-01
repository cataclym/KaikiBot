import { Command } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { ITinder } from "../../interfaces/db";
import { errorMessage } from "../../lib/Embeds";
import { getTinderDB } from "../../struct/db";

export default class TinderRemoveDislikes extends Command {
	constructor() {
		super("tinderremovedislikes", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: (m: Message) => errorMessage(m, "Provide a number. Check your tinder lists for the specific numbers"),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<ITinder> {
		const db = await getTinderDB(message.author.id);

		if (db.dislikeIDs.length) {

			if (db.dislikeIDs.length >= integer) {
			// Matches given number to array item
				const userID = db.dislikeIDs.splice(integer, 1),
					RemovedMember = message.client.users.cache.get(userID.toString() as Snowflake);

				message.channel.send(`Removed ${RemovedMember ? RemovedMember?.username : "<@" + userID + ">"} from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
			else {
				message.channel.send(new MessageEmbed()
					.setDescription("Please provide a valid number.")
					.withErrorColor(message),
				);
			}
		}
		else {
			message.channel.send("Nothing to delete.");
		}
		db.markModified("dislikeIDs");
		return db.save();
	}
}