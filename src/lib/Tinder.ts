import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Message, MessageEmbed, User } from "discord.js";
import { rollsCache } from "../commands/Tinder/tinder";
import { ITinder } from "../interfaces/db";
import { getTinderDocument } from "../struct/documentMethods";
import { hexColorTable } from "./Color";
import { msToTime, timeToMidnight } from "./functions";

async function tinderDBService(user: User): Promise<void> {
	await getTinderDocument(user.id);
}

async function noMoreLikesOrRolls(value: "rolls" | "likes"): Promise<string> {
	return `You don't have any more ${value}!\nLikes and rolls reset in: ${msToTime(timeToMidnight())}`;
}

async function separateTinderList(message: Message, Item: string[], ListName = "Tinder list"): Promise<Message> {

	if (!Item.length) { return message.reply("There doesn't seem to be anyone here"); }

	const pages = [];
	for (let i = 30, p = 0; p < Item.length; i = i + 30, p = p + 30) {
		pages.push(new MessageEmbed()
			.setTitle(ListName)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
		// Edited for 30 items pr page with correct index number
			.setDescription(Item.slice(p, i).length
				? Item.map((item, itemIndex) => `**${+itemIndex + 1}**. ${message.client.users.cache
					.find(member => member.id === item)
					? message.client.users.cache
						.find(member => member.id === item)?.username
					: "`User has left guild`"}`)
					.slice(p, i)
				: "There doesn't seem to be anyone here")
			.withOkColor(message));
	}
	return editMessageWithPaginatedEmbeds(message, pages, {});
}

const allListMap = async (message: Message, DataAndID: string[]) => {
	return DataAndID.slice(0, 20)
		.map((item, i) => {
			const usr = message.client.users.cache.find(_user => _user.id === item),
				result = usr
					? usr.username
					: item;
			return `${+i + 1}. ${result}`;
		}).join("\n");
};

async function fetchUserList(message: Message, user: User): Promise<Message> {

	const embed = new MessageEmbed()
		.setTitle(user.username + "'s tinder list")
		.withOkColor(message);

	const { datingIDs, marriedIDs, dislikeIDs, likeIDs } = (await getTinderDocument(user.id));

	embed.addFields(
		{ name: "Liked 👍", value: likeIDs?.length ? await allListMap(message, likeIDs) : "N/A", inline: true },
		{ name: "Disliked ❌", value: dislikeIDs?.length ? await allListMap(message, dislikeIDs) : "N/A", inline: true },
		{ name: "Dating ❤️", value: datingIDs?.length ? await allListMap(message, datingIDs) : "N/A", inline: true });

	if (marriedIDs.length) {
		embed.addFields(
			{ name: "\u200B", value: "\u200B", inline: true },
			{ name: "Married 🌟", value: await allListMap(message, marriedIDs) + "\u200B", inline: true },
			{ name: "\u200B", value: "\u200B", inline: true },
		);
	}
	return message.channel.send(embed);
}

async function tinderNormalLike(message: Message, SentMsg: Message, genericEmbed: MessageEmbed, randomUsr: User, tinderUserData: ITinder, ramdomUsrData: ITinder): Promise<void> {

	if (tinderUserData.likes <= 0) {

		SentMsg.reactions.removeAll();
		message.channel.send(await noMoreLikesOrRolls("likes"));
	}

	else {

		--tinderUserData.likes;
		tinderUserData.markModified("likes");

		// Updates leftover likes/rolls in real-time /s
		const NewRollsLikes = `${tinderUserData.rolls} rolls, ${tinderUserData.likes} likes remaining.`,
			newEmbed = new MessageEmbed(genericEmbed)
				.setAuthor("❤️❤️❤️")
				.setTitle(randomUsr.username)
				.setFooter(NewRollsLikes);

		if (ramdomUsrData.likeIDs.includes(message.author.id)) {

			tinderUserData.datingIDs.push(randomUsr.id);
			ramdomUsrData.datingIDs.push(message.author.id);

			tinderUserData.markModified("datingIDs");
			ramdomUsrData.markModified("datingIDs");

			if (message.guild?.me?.permissions.has("MANAGE_MESSAGES")) SentMsg.reactions.removeAll();

			SentMsg.edit(newEmbed
				.setColor(hexColorTable["deeppink"])
				.setDescription("It's a match! Congratulations!"),
			);
		}

		else {

			ramdomUsrData.likeIDs.push(randomUsr.id);
			ramdomUsrData.markModified("likeIDs");

			if (message.guild?.me?.permissions.has("MANAGE_MESSAGES")) SentMsg.reactions.removeAll();

			SentMsg.edit(newEmbed
				.setColor(hexColorTable["lawngreen"])
				.setDescription("has been added to likes!"),
			);
		}
	}
	tinderUserData.markModified("rolls");
	tinderUserData.save();
	ramdomUsrData.save();
}

async function tinderDislike(message: Message, SentMsg: Message, genericEmbed: MessageEmbed, randomUsr: User, tinderUserData: ITinder, ramdomUsrData: ITinder): Promise<void> {

	tinderUserData.dislikeIDs.push(randomUsr.id);

	const NewRollsLikes = `${tinderUserData.rolls} rolls, ${tinderUserData.likes} likes remaining.`;

	if (message.guild?.me?.permissions.has("MANAGE_MESSAGES")) SentMsg.reactions.removeAll();

	SentMsg.edit(new MessageEmbed(genericEmbed)
		.setAuthor("❌❌❌")
		.setColor(hexColorTable["red"])
		.setTitle(randomUsr.username)
		.setDescription("has been added to dislikes.")
		.setFooter(NewRollsLikes),
	);

	tinderUserData.markModified("rolls");
	tinderUserData.markModified("dislikeIDs");
	tinderUserData.save();
	ramdomUsrData.save();
}

async function tinderSuperLike(message: Message, SentMsg: Message, genericEmbed: MessageEmbed, randomUsr: User, tinderUserData: ITinder, ramdomUsrData: ITinder): Promise<void> {

	if (tinderUserData.likes > 0) {

		tinderUserData.datingIDs.push(randomUsr.id);
		ramdomUsrData.datingIDs.push(message.author.id);

		rollsCache[message.author.id] = 0;
		tinderUserData.rolls = 0;
		tinderUserData.likes = 0;

		tinderUserData.markModified("likes");

		if (message.guild?.me?.permissions.has("MANAGE_MESSAGES")) SentMsg.reactions.removeAll();

		SentMsg.edit(new MessageEmbed(genericEmbed)
			.setAuthor("❤️🌟❤️")
			.setColor(hexColorTable["yellow"])
			.setTitle(randomUsr.username)
			.setDescription("Is now dating you!")
			.setFooter("You have no rolls or likes remaining."),
		);
	}
	else {
		SentMsg.reactions.removeAll();
		message.channel.send(await noMoreLikesOrRolls("likes"));
	}

	tinderUserData.save();
	ramdomUsrData.save();
}

export {
    tinderDBService, noMoreLikesOrRolls, separateTinderList, fetchUserList,
    tinderDislike, tinderNormalLike, tinderSuperLike,
};

