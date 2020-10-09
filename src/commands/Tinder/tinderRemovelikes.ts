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
		if (!likes[1]) {
			return message.util?.send("Nothing to delete.");
		}
		const removedItem = likes.splice(args.integer, 1);
		if (!(removedItem.toString() === message.author.id) && removedItem) {
			Tinder.set(`likeID.${message.author.id}`, likes);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			return message.util?.send(`Removed \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}
	}
};