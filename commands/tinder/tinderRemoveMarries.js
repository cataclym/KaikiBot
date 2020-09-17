"use strict";
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

module.exports = class TinderRemoveMarries extends Command {
	constructor() {
		super("tinderremovemarries", {
			id: "tinderremovemarries",
			aliases: ["tinderremovemarries"],
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: new MessageEmbed().setDescription("Provide a number. Check your tinder lists for the specific numbers").setColor("#ff0000"),
				},
			],
		});
	}
	async exec(message, args) {
		const marries = [...new Set(Tinder.fetch(`married.${message.author.id}`))];
		if (marries === null || !Array.isArray(marries)) {
			return message.util.send("Nothing to delete.");
		}
		const combinedMarries = marries.map(a => a);
		const removedItem = combinedMarries.splice(args.integer, 1);
		if (!(removedItem.toString() === message.author.id && removedItem)) {
			Tinder.set(`married.${message.author.id}`, combinedMarries);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			const userList = [...new Set(Tinder.fetch(`dating.${removedItem}`))].map(a => a);
			if (!userList || !Array.isArray(userList)) {
				return null;
			}
			const userNumber = userList.indexOf(message.author.id);
			userList.splice(userNumber, 1);
			Tinder.set(`married.${removedItem}`, userList);

			return message.util.send(`You divorced \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\`!`).then(SentMsg => {
				SentMsg.react("✅");
				SentMsg.react("💔");
			});
		}
	}
};