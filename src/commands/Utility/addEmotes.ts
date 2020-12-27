import { Argument, Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import sizeOf from "image-size";
import { noArgGeneric } from "../../util/embeds";
import { deleteImage, getFileOut, resizeImage, saveEmoji, saveFile } from "../../util/Emote";
const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
export default class AddEmotesCommand extends Command {
	constructor() {
		super("addemotes", {
			aliases: ["addemotes", "aes"],
			description: { description: "Adds multiple emotes. Cannot specify names.", usage: "https://discord.com/assets/28174a34e77bb5e5310ced9f95cb480b.png https://cdn.discordapp.com/avatars/140788173885276160/a_a8c1ebfb526b8850b2f125c440e8f6b7.gif" },
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

