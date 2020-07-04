const Canvas = require("canvas");
const Discord = require("discord.js");

module.exports = {
	name: "simp",
	aliases: ["simping","simper"],
	description: "embarass your simp friend",
	args: true,
	usage: "@dreb",
	async execute(message, args) {
		function getUserFromMention(mention) {
			if (!mention) return;
		
			if (mention.startsWith("<@") && mention.endsWith(">")) {
				mention = mention.slice(2, -1);
		
				if (mention.startsWith("!")) {
					mention = mention.slice(1);
				}
				return message.client.users.cache.get(mention);
			}
		}
		if (args[0]) {
			const user = getUserFromMention(args[0]);
			if (!user) {
				await message.channel.stopTyping(true);
				return message.reply("Please tag a user!");
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
			
			const av = message.mentions.users.first();
			const canvas = Canvas.createCanvas(500, 400);
			const ctx = canvas.getContext("2d");

			const background = await Canvas.loadImage("./images/simp.jpg");
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
			ctx.font = applyText(canvas, av.username);
			ctx.fillStyle = "#ffffff";
			ctx.fillText(av.username, 300, canvas.height / 1.25);
        
			ctx.beginPath();
			ctx.arc(360, 220, 50, 0, Math.PI * 2, true); // Coordinates for the avatar cut (Not entirely accurate, I think)
			ctx.closePath();
			ctx.clip();

			const avatar = await Canvas.loadImage(av.displayAvatarURL({ format: "jpg" }));
			ctx.drawImage(avatar, 310, 170, 100, 100);

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "Simper.jpg");
			message.channel.send(`Haha, you're a simp!! ${message.mentions.users.first()}`, attachment);
			await message.channel.stopTyping(true);
		}
	},  
};