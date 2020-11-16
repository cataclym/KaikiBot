import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";
import sizeOf from "image-size";
import { deleteImage, getFileOut, resizeImage, saveEmoji, saveFile } from "../../functions/Emote";
const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
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
					id: "url",
					type: Argument.union(imgRegex),
					match: "separate",
				},
			],
		});
	}
	public async exec(message: Message, { urls }: { urls: string[] }): Promise<Message | void> {

		urls.forEach(async (url) => {

			const file = getFileOut(message);
			await saveFile(url, file);

			// Example output: { width: 240, height: 240, type: 'gif' }
			const imgDimensions = sizeOf(file);

			if ((imgDimensions.width && imgDimensions.height) && imgDimensions.width <= 128 && imgDimensions.height <= 128) {
				await saveEmoji(message, url, name);
			}
			else if (imgDimensions.type) {
				const img = await resizeImage(file, imgDimensions.type, 128, message);
				await saveEmoji(message, img, name);
			}
			deleteImage(file);
		});
	}
}

