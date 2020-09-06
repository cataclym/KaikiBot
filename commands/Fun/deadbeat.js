const Canvas = require("canvas");
const Discord = require("discord.js");
const { ParseMemberObject } = require("../../functions/functions");

module.exports = {
	name: "deadbeat",
	cooldown: 8,
	aliases: ["deadbeats", "deadbeating"],
	description: "Just try it",
	args: false,
	usage: "@dreb",
	cmdCategory: "Fun",
	async execute(message, args) {
		try {
			let member = message.member;
			if (args[0]) {
				member = ParseMemberObject(message, args);
				if (!member) {
					return message.reply("I couldn't find a user by " + args[0] + ", try using their name/id/@mention.");
				}
			}
			message.channel.startTyping();

			const applyText = (canvas, text) => {
				const ctx = canvas.getContext("2d");

				let fontSize = 70;

				do {
					ctx.font = `${fontSize -= 10}px sans-serif`;
				} while (ctx.measureText(text).width > 240);

				return ctx.font;
			};
			const canvas = Canvas.createCanvas(960, 540);
			const ctx = canvas.getContext("2d");

			const background = await Canvas.loadImage("./images/deadbeats.jpg");
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

			ctx.font = applyText(canvas, `${member.user.username}`);
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.fillText(`${member.user.username}`, 670, canvas.height / 2.10);

			ctx.beginPath();
			ctx.arc(670, 160, 50, 0, Math.PI * 2, true);
			// Coordinates for the avatar cut (Not entirely accurate)
			ctx.closePath();
			ctx.clip();

			const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "jpg" }));
			ctx.drawImage(avatar, 620, 110, 100, 100);

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "DEDBeats.jpg");
			message.channel.send(`Deadbeat 👉 ${member.user}`, attachment);
			await message.channel.stopTyping(true);
		}
		catch (error) {
			await message.channel.stopTyping(true);
			return message.channel.send("An error occured " + error);
		}
	},
};