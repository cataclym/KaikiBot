/* eslint-disable max-statements-per-line */
const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { timeToMidnight, msToTime } = require("./functions");
const paginationEmbed = require("discord.js-pagination");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

// function TinderProfile(message) {
// 	//...
// }
async function TinderStartup(message) {
	// This will spam the console from TinderDBService sadly // Edit: fixed it somewhat.
	let i = 0;
	message.client.users.cache.forEach(user => {
		TinderDBService(user);
		i++;
	});
	console.log("Tinder Database Service | Tinder has completed startup procedure. | " + i + " users registered in Tinder DB");
}
async function TinderDBService(user) {
	// This is the peak of JS
	let i = 0;
	if (!Tinder.has(`rolls.${user.id}`)) { Tinder.add(`rolls.${user.id}`, 15); i++; }
	if (!Tinder.has(`likes.${user.id}`)) { Tinder.add(`likes.${user.id}`, 3); i++; }
	if (!Tinder.has(`dating.${user.id}`)) { Tinder.push(`dating.${user.id}`, user.id); i++; }
	if (!Tinder.has(`likeID.${user.id}`)) { Tinder.push(`likeID.${user.id}`, user.id); i++; }
	if (!Tinder.has(`dislikeID.${user.id}`)) { Tinder.push(`dislikeID.${user.id}`, user.id); i++; }
	if (!Tinder.has(`married.${user.id}`)) { Tinder.push(`married.${user.id}`, user.id); i++; }
	if (i > 0) {
		console.log("Tinder Database Service | Checking " + (user?.username?.length ? user?.username : user?.user?.username) + " | Ran " + i + " changes.");
	}
}
function NoLikes() {
	const time2mid = timeToMidnight();
	const time2midHrs = msToTime(time2mid);
	return "You don't have any more likes!\nLikes and rolls reset in: " + time2midHrs;
}
function NoRolls() {
	const time2mid = timeToMidnight();
	const time2midHrs = msToTime(time2mid);
	return "You don't have any more rolls!\nLikes and rolls reset in: " + time2midHrs;
}
function SeparateTinderList(message, Item) {
	Item.shift();
	if (!Item.length) { return message.reply("There doesn't seem to be anyone here"); }

	const color = message.member.displayColor;
	const pages = [];
	for (let i = 30, p = 0; p < Item.length; i = i + 30, p = p + 30) {
		const dEmbed = new MessageEmbed()
			.setTitle("There are **" + Item.length + "** users in this list.")
			.setColor(color)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			// Edited for 30 items pr page with correct index number
			.setDescription(Item.slice(p, i).length ? Item.map((item, itemIndex) => `**${+itemIndex + 1}**. ${message.client.users.cache.find(member => member.id === item) ? message.client.users.cache.find(member => member.id === item).username : "`User has left guild`"}`).slice(p, i) : "There doesn't seem to be anyone here");
		pages.push(dEmbed);
	}
	paginationEmbed(message, pages);
}
function fetchUserList(message, user) {
	TinderDBService(user);
	const listembed = new MessageEmbed()
		.setTitle(user.username + "'s tinder list")
		.setColor(message.member.displayColor);
	const LlikesID = [...new Set(Tinder.get(`likeID.${user.id}`))];
	const LdislikeID = [...new Set(Tinder.get(`dislikeID.${user.id}`))];
	const Ldating = [...new Set(Tinder.get(`dating.${user.id}`))];
	const Lmarried = [...new Set(Tinder.get(`married.${user.id}`))];

	function allListMap(DataAndID) {
		return DataAndID.slice(1, 21).map((item, i) => `${+i + 1}. ${message.client.users.cache.find(_user => _user.id === item) ? message.client.users.cache.find(_user => _user.id === item).username : "User left guild"}`).join("\n");
	}

	listembed.addFields(
		{ name: "Likes", value: LlikesID.slice(1).length ? allListMap(LlikesID).substring(0, 660) : "N/A", inline: true },
		{ name: "Dislikes", value: LdislikeID.slice(1).length ? allListMap(LdislikeID).substring(0, 660) : "N/A", inline: true },
		{ name: "Dating", value: Ldating.slice(1).length ? allListMap(Ldating).substring(0, 660) : "N/A", inline: true });
	if (Lmarried.slice(1).length) {
		listembed.addFields(
			{ name: "\u200B", value: "\u200B", inline: true },
			{ name: "Married", value: allListMap(Lmarried).substring(0, 660) + "\u200B", inline: true },
			{ name: "\u200B", value: "\u200B", inline: true },
		);
	}
	message.channel.send(listembed);
}

async function tinderNodeCanvasImage(message, randomUser) {

	const userStates = {
		"online" : "#00FF00", "offline" : "#6E0DD0", "idle" : "#FF0099", "dnd" : "FD1C03",
	};

	const applyText = (canvas, text) => {
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
	circlePath.fill(circlePath);

	const fileAttachment = new MessageAttachment(canvas.toBuffer(), "tinderProfile.png");
	return message.channel.send(new MessageEmbed().attachFiles([fileAttachment]).setImage("attachment://tinderProfile.png").setColor(message.member.displayColor));
}
module.exports = {
	TinderStartup, TinderDBService, NoLikes, NoRolls, SeparateTinderList, fetchUserList, tinderNodeCanvasImage,
};