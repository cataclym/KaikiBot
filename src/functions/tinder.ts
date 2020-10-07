import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { timeToMidnight, msToTime } from "./functions";
import paginationEmbed from "@cataclym/discord.js-pagination-ts-nsb";
import { MessageEmbed, MessageAttachment } from "discord.js";
import Canvas from "canvas";
import { Message } from "discord.js";
import { User } from "discord.js";
import { getMemberColorAsync } from "./Util";
const userStates: any = {
	"online" : "#00FF00",
	"offline" : "#6E0DD0",
	"idle" : "#FF0099",
	"dnd" : "#FD1C03",
};

// function TinderProfile(message) {
// 	//...
// }
async function TinderStartup(message: Message): Promise<void> {
	// This will spam the console from TinderDBService sadly // Edit: fixed it somewhat.
	let i = 0;
	message.client.users.cache.forEach(user => {
		TinderDBService(user);
		i++;
	});
	console.log("Tinder Database Service | Tinder has completed startup procedure. | " + i + " users registered in Tinder DB");
}
async function TinderDBService(user: User): Promise<void> {
	// This is the peak of JS
	let i = 0;
	if (!Tinder.has(`rolls.${user.id}`)) {
		Tinder.add(`rolls.${user.id}`, 15);
		i++;
	}
	if (!Tinder.has(`likes.${user.id}`)) {
		Tinder.add(`likes.${user.id}`, 3);
		i++;
	}
	if (!Tinder.has(`dating.${user.id}`)) {
		Tinder.push(`dating.${user.id}`, user.id);
		i++;
	}
	if (!Tinder.has(`likeID.${user.id}`)) {
		Tinder.push(`likeID.${user.id}`, user.id);
		i++;
	}
	if (!Tinder.has(`dislikeID.${user.id}`)) {
		Tinder.push(`dislikeID.${user.id}`, user.id);
		i++;
	}
	if (!Tinder.has(`married.${user.id}`)) {
		Tinder.push(`married.${user.id}`, user.id);
		i++;
	}
	if (i > 0) {
		console.log("Tinder Database Service | Checking " + user?.username + " | Ran " + i + " changes.");
	}
}
function NoLikes(): string {
	const time2mid = timeToMidnight();
	const time2midHrs = msToTime(time2mid);
	return "You don't have any more likes!\nLikes and rolls reset in: " + time2midHrs;
}
async function NoRolls(): Promise<string> {
	const time2mid = timeToMidnight();
	const time2midHrs = msToTime(time2mid);
	return "You don't have any more rolls!\nLikes and rolls reset in: " + time2midHrs;
}
async function SeparateTinderList(message: Message, Item: string[], ListName = "Tinder list"): Promise<Message> {

	Item.shift();
	if (!Item.length) { return message.reply("There doesn't seem to be anyone here"); }

	const pages = [];
	for (let i = 30, p = 0; p < Item.length; i = i + 30, p = p + 30) {
		const dEmbed = new MessageEmbed()
			.setTitle(ListName)
			.setColor(await getMemberColorAsync(message))
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			// Edited for 30 items pr page with correct index number
			.setDescription(Item.slice(p, i).length ? Item.map((item, itemIndex) => `**${+itemIndex + 1}**. ${message.client.users.cache.find(member => member.id === item) ? message.client.users.cache.find(member => member.id === item)?.username : "`User has left guild`"}`).slice(p, i) : "There doesn't seem to be anyone here");
		pages.push(dEmbed);
	}
	return paginationEmbed.editMessageWithPaginatedEmbeds(message, pages, {});
}

const allListMap = async (message: Message, DataAndID: unknown[]) => {
	return DataAndID.slice(1, 21).map((item, i) => `${+i + 1}. ${message.client.users.cache.find(_user => _user.id === item) ? message.client.users.cache.find(_user => _user.id === item)?.username : "User left guild"}`).join("\n");
};

async function fetchUserList(message: Message, user: User): Promise<Message> {
	await TinderDBService(user);
	this.embed = new MessageEmbed()
		.setTitle(user.username + "'s tinder list")
		.setColor(await getMemberColorAsync(message));
	const LikesID = [...new Set(Tinder.get(`likeID.${user.id}`))];
	const DislikeID = [...new Set(Tinder.get(`dislikeID.${user.id}`))];
	const Dating = [...new Set(Tinder.get(`dating.${user.id}`))];
	const Married = [...new Set(Tinder.get(`married.${user.id}`))];

	this.embed.addFields(
		{ name: "Liked 👍", value: LikesID.slice(1)?.length ? await allListMap(message, LikesID) : "N/A", inline: true },
		{ name: "Disliked ❌", value: DislikeID.slice(1)?.length ? await allListMap(message, DislikeID) : "N/A", inline: true },
		{ name: "Dating ❤️", value: Dating.slice(1)?.length ? await allListMap(message, Dating) : "N/A", inline: true });
	if (Married.slice(1)?.length) {
		this.embed.addFields(
			{ name: "\u200B", value: "\u200B", inline: true },
			{ name: "Married 🌟", value: await allListMap(message, Married) + "\u200B", inline: true },
			{ name: "\u200B", value: "\u200B", inline: true },
		);
	}
	return message.channel.send(this.embed);
}

async function tinderNodeCanvasImage(message: Message, randomUser: User): Promise<Message> {

	const applyText = (canvas: Canvas.Canvas, text: string) => {
		const ctx = canvas.getContext("2d");
		// Declare a base size of the font
		let fontSize = 40;
		do {
			// Assign the font to the context and decrement it so it can be measured again
			ctx.font = `${fontSize -= 10}px sans-serif`;
			// Compare pixel width of the text to the canvas minus the approximate avatar size
		} while (ctx.measureText(text).width > canvas.width);

		// Return the result to use in the actual canvas
		return ctx.font;
	};

	const canvas = Canvas.createCanvas(400, 400);
	const ctx = canvas.getContext("2d");

	const tinderBackground = await Canvas.loadImage("./images/wallhaven-621410.png");
	const tinderTemplate = await Canvas.loadImage("./images/tinderTemplate.png");
	const avatar = await Canvas.loadImage(randomUser.displayAvatarURL({ format: "png" }));

	// base image
	ctx.drawImage(tinderBackground, -100, 0, 768, 432);
	ctx.drawImage(tinderTemplate, 0, 0, 400, 400);
	ctx.drawImage(avatar, 10, 10, 168, 168);
	// text box
	ctx.beginPath();
	ctx.rect(4, 240, 392, 156);
	ctx.fillStyle = "rgba(249,25,145,0.7)";
	ctx.fill();
	// lots of text with shadow
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	ctx.font = "28px Bahnschrift";
	ctx.fillText(randomUser.presence.status, 76, 359);
	ctx.font = "24px Bahnschrift";
	ctx.fillText("This text box is lonely, and so are you.", 7, 263, 379);
	ctx.font = "40px Bahnschrift";
	ctx.textAlign = "center";
	ctx.font = applyText(canvas, randomUser.username);
	ctx.fillText(randomUser.username, 202, canvas.height / 1.95);
	ctx.fillStyle = "#7eaaff";
	ctx.fillText(randomUser.username, 200, canvas.height / 1.95);
	ctx.textAlign = "start";
	ctx.font = "24px Bahnschrift";
	ctx.fillText("This text box is lonely, and so are you.", 6, 264, 380);
	ctx.fillStyle = userStates[randomUser.presence.status];
	// userState text
	ctx.font = "28px Bahnschrift";
	ctx.fillStyle = userStates[randomUser.presence.status];
	ctx.fillText(randomUser.presence.status, 75, 360);
	// userState circle
	const circlePath = canvas.getContext("2d");
	circlePath.beginPath();
	ctx.fillStyle = userStates[randomUser.presence.status];
	circlePath.fillStyle = userStates[randomUser.presence.status];
	circlePath.arc(40, 360, 25, 0, 2 * Math.PI);
	circlePath.fill();

	const fileAttachment = new MessageAttachment(canvas.toBuffer(), "tinderProfile.png");
	return message.channel.send(new MessageEmbed().attachFiles([fileAttachment]).setImage("attachment://tinderProfile.png").setColor(await getMemberColorAsync(message)));
}
async function NormalLike(message: Message, SentMsg: Message, genericEmbed: MessageEmbed, newHasRolls: number, hasLikes: number, randomUsr: User): Promise<Message> {
	if (hasLikes > 0) {
		Tinder.subtract(`likes.${message.author.id}`, 1);
		const newHasLikes = parseInt(Tinder.get(`likes.${message.author.id}`), 10);
		// Updates leftover likes/rolls in real-time /s
		const NewRollsLikes = newHasRolls + " rolls " + newHasLikes + " likes remaining.";
		if (Tinder.has(`likeID.${randomUsr.id}`)) {
			// Prevents choke
			const checkLikeIDs = Tinder.get(`likeID.${randomUsr.id}`);
			// Theoretically this part should work
			if (checkLikeIDs.includes(`${message.author.id}`)) {
				Tinder.push(`dating.${message.author.id}`, randomUsr.id);
				Tinder.push(`dating.${randomUsr.id}`, message.author.id);
				SentMsg.reactions.removeAll();
				const newEmbed = new MessageEmbed(genericEmbed)
					.setAuthor("❤️❤️❤️")
					.setColor("#ff00ff")
					.setTitle(randomUsr.username)
					.setDescription("It's a match! Congratulations!")
					.setFooter(NewRollsLikes);
				return SentMsg.edit(newEmbed);
			}
		}
		await TinderDBService(randomUsr);
		Tinder.push(`likeID.${message.author.id}`, randomUsr.id);
		SentMsg.reactions.removeAll();
		const newEmbed = new MessageEmbed(genericEmbed)
			.setAuthor("❤️❤️❤️")
			.setColor("#00FF00")
			.setTitle(randomUsr.username)
			.setDescription("has been added to likes!")
			.setFooter(NewRollsLikes);
		return SentMsg.edit(newEmbed);
	}
	else {
		SentMsg.reactions.removeAll();
		return message.channel.send(NoLikes());
	}
}

async function Dislike(message: Message, SentMsg: Message, genericEmbed: MessageEmbed, newHasRolls: number, hasLikes: number, randomUsr: User): Promise<Message> {
	Tinder.push(`dislikeID.${message.author.id}`, randomUsr.id);
	const NewRollsLikes = newHasRolls + " rolls " + hasLikes + " likes remaining.";
	SentMsg.reactions.removeAll();
	const newEmbed = new MessageEmbed(genericEmbed)
		.setAuthor("❌❌❌")
		.setColor("#00FF00")
		.setTitle(randomUsr.username)
		.setDescription("has been added to dislikes.")
		.setFooter(NewRollsLikes);
	return SentMsg.edit(newEmbed);
}
async function SuperLike(message: Message, SentMsg: Message, genericEmbed: MessageEmbed, hasLikes: number, randomUsr: User): Promise<Message> {
	if (hasLikes > 0) {
		const zero = Math.floor(0);
		await TinderDBService(randomUsr);
		Tinder.push(`dating.${message.author.id}`, randomUsr.id);
		Tinder.push(`dating.${randomUsr.id}`, message.author.id);
		Tinder.set(`rolls.${message.author.id}`, zero);
		Tinder.set(`likes.${message.author.id}`, zero);
		SentMsg.reactions.removeAll();
		const newEmbed = new MessageEmbed(genericEmbed)
			.setAuthor("❤️🌟❤️")
			.setColor("#FFFF00")
			.setTitle(randomUsr.username)
			.setDescription("Is now dating you!")
			.setFooter("You have no rolls or likes remaining.");
		return SentMsg.edit(newEmbed);
	}
	else {
		SentMsg.reactions.removeAll();
		return message.channel.send(NoLikes());
	}
}

export {
	TinderStartup, TinderDBService, NoLikes, NoRolls, SeparateTinderList, fetchUserList, tinderNodeCanvasImage, Dislike, NormalLike, SuperLike,
};