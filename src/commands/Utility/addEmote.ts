import { createCanvas, loadImage } from "canvas";
import { Command } from "discord-akairo";
import { Emoji, Message, MessageEmbed } from "discord.js";
import { errorColor, getMemberColorAsync, trim } from "../../functions/Util";

export default class AddEmoteCommand extends Command {
	constructor() {
		super("addemote", {
			aliases: ["addemote", "ae"],
			description: { description: "", usage: "" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			args: [
				{
					id: "emote",
					type: "emojiMention",
				},
				{
					id: "name",
					type: "string",
					match: "rest",
				},
			],
		});
	}
	public async exec(message: Message, { emote, name }: { emote: Emoji, name: string }): Promise<Message | void> {

		if (emote) {
			if (emote.url) {
				const img = await loadImage(emote.url);
				const canv = createCanvas(img.width, img.height);
				const ctx = canv.getContext("2d");
				ctx.drawImage(img, img.width, img.height);
				const buffer = canv.toBuffer();

				try {
					const newEmote = await message.guild?.emojis.create(buffer, (name?.length >= 2 ? trim(name, 32) : emote.name));
					return message.channel.send(new MessageEmbed({
						title: "Success!",
						description: `Added \`${newEmote?.name}\`!`,
						color: await getMemberColorAsync(message),
						image: { url: newEmote?.url },
					}));
				}
				catch {
					return message.channel.send(new MessageEmbed({
						title: "Error",
						description: "Could not add this emoji. Does the current guild have space for new emoji?",
						color: errorColor,
					}));
				}
			}
		}
	}
}