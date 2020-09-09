const Canvas = require("canvas");
const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class DeadbeatCommand extends Command {
	constructor() {
		super("deadbeat", {
			id: "deadbeat",
			aliases: ["dead", "deadbeat"],
			description: { description: "Just try it", usage: "@dreb" },
			cooldown: 8000,
			typing: true,
			args: [{
				id: "member",
				type: "member",
				match: "rest",
				default: (message) => {
					return message.member;
				},
			}],
		});
	}

	async exec(message, args) {
		const member = args.member || args.default;
		const applyText = (canvas, text) => {
			const ctx = canvas.getContext("2d");

			let fontSize = 70;

			do {
				ctx.font = `${fontSize -= 4}px sans-serif`;
			} while (ctx.measureText(text).width > 300);

			return ctx.font;
		};
		const canvas = Canvas.createCanvas(960, 540);
		const ctx = canvas.getContext("2d");

		const background = await Canvas.loadImage("./images/deadbeats.jpg");
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = "#000000";
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = applyText(canvas, member.displayName);
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.rotate(0.02);
		ctx.fillText(member.displayName, 677, canvas.height / 2.20);

		ctx.rotate(-0.02);
		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "png" }));
		ctx.drawImage(avatar, 620, 100, 100, 100);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "deadBeats.jpg");
		await message.util.send(`Deadbeat 👉 ${member.user}`, attachment);
	}
};