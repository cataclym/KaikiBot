import jimp from "jimp";
import { Command } from "discord-akairo";
import { Message, GuildMember, MessageAttachment } from "discord.js";

// const background = async () => await loadImage("https://cdn.discordapp.com/attachments/717045059215687691/763459005137420328/simp.jpg");
export default class SimpCommand extends Command {
	constructor() {
		super("simp", {
			aliases: ["simp"],
			description: { description: "Embarrass your simp friend", usage: "@dreb" },
			cooldown: 8000,
			typing: true,
			args: [{
				id: "member",
				type: "member",
				default: (message: Message) => {
					return message.member;
				},
			}],
		});
	}
	async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | void> {

		const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
		const newSimp = await jimp.read("https://cdn.discordapp.com/attachments/717045059215687691/763459005137420328/simp.jpg");
		newSimp.resize(500, 400);
		newSimp.print(font, 290, 280, { text: member.displayName, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: jimp.VERTICAL_ALIGN_MIDDLE }, 150);
		const avatar = await jimp.read(member.user.displayAvatarURL({ format: "png" }));
		newSimp.composite(avatar, 300, 140);

		// ctx.drawImage(avatar, 300, 140, 100, 100);

		// const applyText = (canvas: ), text: string) => {
		// 	const ctx = canvas.getContext("2d");
		// 	// Declare a base size of the font
		// 	let fontSize = 60;
		// 	do {
		// 		// Assign the font to the context and decrement it so it can be measured again
		// 		ctx.font = `${fontSize -= 1}px sans-serif`;
		// 		// Compare pixel width of the text to the canvas minus the approximate avatar size
		// 	} while (ctx.measureText(text).width > canvas.width / 3);

		// 	// Return the result to use in the actual canvas
		// 	return ctx.font;
		// };
		// const canvas = Canvas.createCanvas(500, 400);
		// const ctx = canvas.getContext("2d");

		// ctx.drawImage(await background(), 0, 0, canvas.width, canvas.height);

		// ctx.strokeStyle = "#000000";
		// ctx.strokeRect(0, 0, canvas.width, canvas.height);

		// ctx.font = applyText(canvas, member.displayName);
		// ctx.fillStyle = "#ffffff";
		// ctx.textAlign = "center";
		// ctx.textBaseline = "middle";
		// ctx.fillText(member.displayName, 350, 280);

		// const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "png" }));
		// ctx.drawImage(avatar, 300, 140, 100, 100);
		const simp = new MessageAttachment(await newSimp.getBufferAsync(jimp.MIME_JPEG));
		// const attachment = new MessageAttachment("Simper.jpg");
		await message.util?.send(`Haha, you're a simp!! ${member.user}`, simp);
	}
}