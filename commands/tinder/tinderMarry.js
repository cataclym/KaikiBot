"use strict";
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { Command } = require("discord-akairo");
const embeds = require("../../functions/embeds.js");
const { MessageEmbed } = require("discord.js");

module.exports = class TinderMarryCommand extends Command {
	constructor() {
		super("marry", {
			id: "marry",
			aliases: ["marry"],
			args: [
				{
					id: "user",
					type: "user",
					otherwise: new MessageEmbed().setDescription("Provide a user you wish you wish to marry.").setColor("#ff0000"),
					// TODO: prompt:
				},
			],
		});
	}
	async exec(message, args) {
		const ArgDates = Tinder.get(`dating.${args.user.id}`);
		if (ArgDates.includes(`${message.author.id}`)) {
			const ArgMarry = Tinder.get(`married.${args.user.id}`);
			const AuthorMarry = Tinder.get(`married.${message.author.id}`),
				MarryMatches = AuthorMarry.filter(f => ArgMarry.includes(f));
			if (!MarryMatches.includes(`${args.user.id}`)) {
				message.channel.send("Do you want to marry " + message.author.username + `, <@${args.user.id}>?` + "\nReact with a ❤️ to marry!")
					.then(heart => {
						heart.react("❤️");
						const filter = (reaction, user) => {
							return reaction.emoji.name === "❤️" && user.id === args.user.id;
						};
						heart.awaitReactions(filter, { max: 1, time: 50000, errors: ["time"] })
							.then(() => {
								Tinder.push(`married.${message.author.id}`, args.user.id);
								Tinder.push(`married.${args.user.id}`, message.author.id);
								return message.channel.send(embeds.DMEMarry());
							})
							.catch(() => {
								heart.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return heart.edit("Timed out");
							});
					});
			}
			else { return message.util.send("You can't marry this person!"); }
		}
		else { return message.util.send("You are not dating this person!"); }
	}
};