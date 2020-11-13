import { createCanvas, loadImage } from "canvas";
import { Command } from "discord-akairo";
import { Message, Emoji } from "discord.js";

export default class AddEmotesCommand extends Command {
	constructor() {
		super("addemotes", {
			aliases: ["addemotes"],
			description: { description: "", usage: "" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			args: [
				{
					id: "emotes",
					type: "emojis",
				},
			],
		});
	}
	public async exec(message: Message, { emote: emotes }: { emote: Emoji[] }): Promise<Message | void> {

		console.log(emotes);

		if (emotes) {
			emotes.forEach(async emoji => {
				if (emoji.url) {
					const img = await loadImage(emoji.url);
					const canv = createCanvas(img.width, img.height);
					const ctx = canv.getContext("2d");
					ctx.drawImage(img, img.width, img.height);
					const buffer = canv.toBuffer();

					try {
						await message.guild?.emojis.create(buffer, emoji.name);
					}
					catch {
						//
					}
				}
			});
			return message.channel.send("✨");

		}

	}
}