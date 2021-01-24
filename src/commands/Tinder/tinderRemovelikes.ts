"use strict";
import db from "quick.db";
const Tinder = new db.table("Tinder");
import { Command } from "@cataclym/discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { MessageReaction } from "discord.js";

export default class TinderRemoveLikes extends Command {
	constructor() {
		super("tinderremovelikes", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: (m: Message) => new MessageEmbed().setDescription("Provide a number. Check your tinder lists for the specific numbers").withErrorColor(m),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<Message | MessageReaction> {
		const likes = [...new Set(Tinder.fetch(`${message.author.id}.likeID`))];
		if (!likes[1]) {
			return message.channel.send("Nothing to delete.");
		}
		const removedItem = likes.splice(integer, 1);
		if (!(removedItem.toString() === message.author.id) && removedItem) {
			Tinder.set(`${message.author.id}.likeID`, likes);
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