"use strict";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

module.exports = class TinderRemoveLikes extends Command {
	constructor() {
		super("tinderremovelikes", {
			aliases: ["tinderremovelikes"],
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
		const likes = [...new Set(Tinder.fetch(`likeID.${message.author.id}`))];
		if (likes === null || !Array.isArray(likes)) {
			return message.util?.send("Nothing to delete.");
		}
		const combinedLikes = likes.map(a => a);
		// Matches given number to array item
		const removedItem = combinedLikes.splice(args.integer, 1);
		if (!(removedItem.toString() === message.author.id)) {
			Tinder.set(`likeID.${message.author.id}`, combinedLikes);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			return message.util?.send(`Removed \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}
	}
};