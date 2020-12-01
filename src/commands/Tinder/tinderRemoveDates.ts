"use strict";
import db from "quick.db";
const Tinder = new db.table("Tinder");
import { Command } from "discord-akairo";
import { Message, MessageEmbed, MessageReaction } from "discord.js";

export default class TinderRemoveDates extends Command {
	constructor() {
		super("tinderremovedates", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: new MessageEmbed().setDescription("Provide a number. Check your tinder lists for the specific numbers").setColor("#ff0000"),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<Message | MessageReaction | null> {
		const authorList = [...new Set(Tinder.fetch(`dating.${message.author.id}`))];
		if (!authorList[1]) {
			return message.channel.send("Nothing to delete.");
		}
		const removedItem = authorList.splice(integer, 1);
		if (!(removedItem.toString() === message.author.id) && removedItem) {
			Tinder.set(`dating.${message.author.id}`, authorList);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			const userList = [...new Set(Tinder.fetch(`dating.${removedItem}`))].map(a => a);
			if (!userList || !Array.isArray(userList)) {
				return null;
			}
			const userNumber = userList.indexOf(message.author.id);
			userList.splice(userNumber, 1);
			Tinder.set(`dating.${removedItem}`, userList);

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