import { Argument, Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import sizeOf from "image-size";
import { noArgGeneric } from "../../lib/Embeds";
import { deleteImage, getFileOut, resizeImage, saveEmoji, saveFile } from "../../lib/Emote";
const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/gi;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
export default class AddEmotesCommand extends Command {
	constructor() {
		super("addemotes", {
			aliases: ["addemotes", "aes"],
			description: { description: "Adds multiple emotes. Cannot specify names.", usage: "<img link1> <img link2> <img link3>" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			args: [
				{
					id: "urls",
					type: Argument.union(imgRegex),
					match: "separate",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { urls }: { urls: { match: string[], matches: [][] }[] }): Promise<Message | void> {

		urls.forEach(async (url) => {
			const msNow = Date.now().toString();
			const file = getFileOut(msNow);
			await saveFile(url.match[0], file);

			const name = msNow.substring(7, 39);

			// Example output: { width: 240, height: 240, type: 'gif' }
			const imgDimensions = sizeOf(file);

			if ((imgDimensions.width && imgDimensions.height) && imgDimensions.width <= 128 && imgDimensions.height <= 128) {
				await saveEmoji(message, url.match[0], name);
			}
			else if (imgDimensions.type) {
				const img = await resizeImage(file, imgDimensions.type, 128, message);
				await saveEmoji(message, img, name);
			}
			deleteImage(file);
		});
	}
}

