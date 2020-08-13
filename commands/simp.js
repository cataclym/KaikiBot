const Canvas = require("canvas");
const Discord = require("discord.js");
const { ParseMemberObject } = require("../functions/functions");

module.exports = {
	name: "simp",
	cooldown: 8,
	aliases: ["simping","simper"],
	description: "embarass your simp friend",
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
        
				let fontSize = 60;
        
				do {
					ctx.font = `${fontSize -= 10}px sans-serif`;
				} while (ctx.measureText(text).width > canvas.width - 300);
    
				return ctx.font;
			};
			const canvas = Canvas.createCanvas(500, 400);
			const ctx = canvas.getContext("2d");

			const background = await Canvas.loadImage("./images/simp.jpg");
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
			ctx.font = applyText(canvas, member.user.username);
			ctx.fillStyle = "#ffffff";
			ctx.fillText(member.user.username, 300, canvas.height / 1.25);
        
			ctx.beginPath();
			ctx.arc(360, 220, 50, 0, Math.PI * 2, true); // Coordinates for the avatar cut (Not entirely accurate, I think)
			ctx.closePath();
			ctx.clip();

			const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "jpg" }));
			ctx.drawImage(avatar, 310, 170, 100, 100);

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "Simper.jpg");
			message.channel.send(`Haha, you're a simp!! ${member.user}`, attachment);
			await message.channel.stopTyping(true);
		}
		catch (error) {
			await message.channel.stopTyping(true);
			return message.channel.send("An error occured " + error);
		}
	},  
};