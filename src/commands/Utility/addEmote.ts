import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";
import sizeOf from "image-size";
import { deleteImage, getFileOut, resizeImage, saveEmoji, saveFile } from "../../functions/Emote";
import { trim } from "../../functions/Util";

// const emoteRegex = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
export default class AddEmoteCommand extends Command {
	constructor() {
		super("addemote", {
			aliases: ["addemote", "ae"],
			description: { description: "Adds an emote from an image link, with an optional name.", usage: "https://discord.com/assets/28174a34e77bb5e5310ced9f95cb480b.png DiscordLogo" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			args: [
				{
					id: "url",
					type: Argument.union(imgRegex),
				},
				{
					id: "name",
					type: "string",
					match: "rest",
				},
			],
		});
	}
	public async exec(message: Message, { url, name }: { url: { match: string[], matches: [][] }, name: string | undefined }): Promise<Message | void> {

		if (!url) return;

		const msNow = Date.now().toString();
		const file = getFileOut(msNow);
		await saveFile(url.match[0], file);

		name = trim(name || msNow, 32);

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
	}
}