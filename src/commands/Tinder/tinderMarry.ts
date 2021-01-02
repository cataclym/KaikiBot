"use strict";
import db from "quick.db";
const Tinder = new db.table("Tinder");
import { Command } from "@cataclym/discord-akairo";
import { DMEMarry } from "../../nsb/Embeds.js";
import { MessageEmbed } from "discord.js";
import { Message, MessageReaction, User } from "discord.js";

module.exports = class TinderMarryCommand extends Command {
	constructor() {
		super("marry", {
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
	public async exec(message: Message, { user }: { user: User}) {
		const ArgDates = Tinder.get(`dating.${user.id}`);
		if (ArgDates.includes(`${message.author.id}`)) {
			const ArgMarry = Tinder.get(`married.${user.id}`);
			const AuthorMarry = Tinder.get(`married.${message.author.id}`),
				MarryMatches = AuthorMarry.filter((f: string) => ArgMarry.includes(f));
			if (!MarryMatches.includes(`${user.id}`)) {
				message.channel.send("Do you want to marry " + message.author.username + `, <@${user.id}>?` + "\nReact with a ❤️ to marry!")
					.then(heart => {
						heart.react("❤️");
						const filter = (reaction: MessageReaction, reactionUser: User) => {
							return reaction.emoji.name === "❤️" && reactionUser.id === user.id;
						};
						heart.awaitReactions(filter, { max: 1, time: 50000, errors: ["time"] })
							.then(async () => {
								Tinder.push(`married.${message.author.id}`, user.id);
								Tinder.push(`married.${user.id}`, message.author.id);
								return message.channel.send(await DMEMarry());
							})
							.catch(() => {
								heart.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
								return heart.edit("Timed out");
							});
					});
			}
			else { return message.util?.send("You can't marry this person!"); }
		}
		else { return message.util?.send("You are not dating this person!"); }
	}
};