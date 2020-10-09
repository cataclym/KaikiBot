"use strict";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

module.exports = class TinderRemoveMarries extends Command {
	constructor() {
		super("tinderremovemarries", {
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
		const marries = [...new Set(Tinder.fetch(`married.${message.author.id}`))];
		if (!marries[1]) {
			return message.util?.send("Nothing to delete.");
		}
		const removedItem = marries.splice(args.integer, 1);
		if (!(removedItem.toString() === message.author.id) && removedItem) {
			Tinder.set(`married.${message.author.id}`, marries);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			const userList = [...new Set(Tinder.fetch(`dating.${removedItem}`))].map(a => a);
			if (!userList || !Array.isArray(userList)) {
				return null;
			}
			const userNumber = userList.indexOf(message.author.id);
			userList.splice(userNumber, 1);
			Tinder.set(`married.${removedItem}`, userList);

			return message.util?.send(`You divorced \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\`!`).then(SentMsg => {
				SentMsg.react("✅");
				SentMsg.react("💔");
			});
		}
	}
};