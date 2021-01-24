"use strict";
import db from "quick.db";
const Tinder = new db.table("Tinder");
import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, MessageReaction } from "discord.js";

export default class TinderRemoveDates extends Command {
	constructor() {
		super("tinderremovedates", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: (m: Message) => new MessageEmbed()
						.setDescription("Provide a number. Check your tinder lists for the specific numbers")
						.withErrorColor(m),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<Message | MessageReaction | null> {

		const authorList = [...new Set(Tinder.fetch(`${message.author.id}.datingIDs`))];

		if (!authorList[1]) {
			return message.channel.send("Nothing to delete.");
		}

		const removedItem = authorList.splice(integer, 1);

		if (!(removedItem.toString() === message.author.id) && removedItem) {
			Tinder.set(`${message.author.id}.datingIDs`, authorList);

			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			const userList = [...new Set(Tinder.fetch(`${removedItem}.datingIDs`))].map(a => a);

			if (!userList || !Array.isArray(userList)) {
				return null;
			}

			const userNumber = userList.indexOf(message.author.id);

			userList.splice(userNumber, 1);
			Tinder.set(`${removedItem}.datingIDs`, userList);

			return message.channel.send(`You stopped dating \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\`.`).then(SentMsg => {
				SentMsg.react("✅");
				return SentMsg.react("💔");
			});
		}
		else {
			return message.channel.send("Something went wrong.");
		}
	}
}