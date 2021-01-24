"use strict";
import db from "quick.db";
const Tinder = new db.table("Tinder");
import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, MessageReaction } from "discord.js";


export default class TinderRemoveDislikes extends Command {
	constructor() {
		super("tinderremovedislikes", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: (m: Message) => new MessageEmbed().setDescription("Provide a number. Check your tinder lists for the specific numbers").withErrorColor(m),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<Message | MessageReaction | null> {

		const DLikes = [...new Set(Tinder.fetch(`${message.author.id}.dislikeIDs`))];

		if (DLikes === null || !Array.isArray(DLikes)) {
			return message.channel.send("Nothing to delete.");
		}

		const CombinedDLikes = DLikes.map(a => a);
		// Matches given number to array item
		const removedItem = CombinedDLikes.splice(integer, 1);

		if (!(removedItem.toString() === message.author.id && removedItem)) {

			Tinder.set(`${message.author.id}.dislikeIDs`, CombinedDLikes);

			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			return message.channel.send(`Removed \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\` from list.`).then(SentMsg => {
				return SentMsg.react("✅");
			});
		}

		else {
			return message.channel.send("Something went wrong.");
		}
	}
}