import { Command } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { ITinder } from "../../interfaces/db";
import { errorMessage } from "../../lib/Embeds";
import { getTinderDocument } from "../../struct/db";

export default class TinderRemoveMarries extends Command {
	constructor() {
		super("tinderremovemarries", {
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
		const db = await getTinderDocument(message.author.id);

		if (db.marriedIDs.length) {

			if (db.marriedIDs.length >= integer) {
				const userID = db.marriedIDs.splice(integer, 1),
					RemovedMember = message.client.users.cache.get(userID[0] as Snowflake),
					rDB = await getTinderDocument(RemovedMember?.id ?? userID[0]),
					userNumber = rDB.marriedIDs.indexOf(message.author.id);

				if (userNumber !== -1) {
					rDB.marriedIDs.splice(userNumber, 1);
				}

				message.channel.send(`You divorced ${RemovedMember ? RemovedMember?.username : "<@" + userID + ">"}!`).then(SentMsg => {
					SentMsg.react("✅");
					SentMsg.react("💔");
				});
				rDB.markModified("marriedIDs");
				rDB.save();
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
		db.markModified("marriedIDs");
		return db.save();
	}
}