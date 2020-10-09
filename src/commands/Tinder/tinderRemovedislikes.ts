"use strict";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

module.exports = class TinderRemoveDislikes extends Command {
	constructor() {
		super("tinderremovedislikes", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: new MessageEmbed().setDescription("Provide a number. Check your tinder lists for the specific numbers").setColor("#ff0000"),
				},
			],
		});
	}
	async exec(message: Message, args: any) {
		const DLikes = [...new Set(Tinder.fetch(`dislikeID.${message.author.id}`))];
		if (DLikes === null || !Array.isArray(DLikes)) {
			return message.util?.send("Nothing to delete.");
		}
		const CombinedDLikes = DLikes.map(a => a);
		// Matches given number to array item
		const removedItem = CombinedDLikes.splice(args.integer, 1);
		if (!(removedItem.toString() === message.author.id && removedItem)) {
			Tinder.set(`dislikeID.${message.author.id}`, CombinedDLikes);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			return message.util?.send(`Removed \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}
	}
};