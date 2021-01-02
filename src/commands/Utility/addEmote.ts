import { Argument, Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import sizeOf from "image-size";
import { noArgGeneric } from "../../nsb/Embeds";
import { deleteImage, getFileOut, resizeImage, saveEmoji, saveFile } from "../../nsb/Emote";
import { trim } from "../../nsb/Util";

const emoteRegex = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
export default class AddEmoteCommand extends Command {
	constructor() {
		super("addemote", {
			aliases: ["addemote", "ae"],
			description: { description: "Adds an emote from an image link, with an optional name.", usage: "https://discord.com/assets/28174a34e77bb5e5310ced9f95cb480b.png DiscordLogo" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			typing: true,
			channel: "guild",
			args: [
				{
					id: "url",
					type: Argument.union(imgRegex, emoteRegex),
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
				{
					id: "name",
					type: "string",
					match: "rest",
				},
			],
		});
	}
	public async exec(message: Message, { url, name }: { url: { match: RegExpMatchArray, matches: [][] }, name: string | undefined }): Promise<Message | void> {

		let emote = undefined;
		const urlMatch = url.match[0].toString();

		if (urlMatch.startsWith("<") && urlMatch.endsWith(">")) {

			const emoteID = urlMatch.match(/\d+/g);

			if (emoteID) {
				emote = `https://cdn.discordapp.com/emojis/${emoteID.toString()}.${urlMatch.indexOf("a") === 1 ? "gif" : "png"}`;
				name = name ?? urlMatch.slice(2, urlMatch.lastIndexOf(":")).replace(":", "");
			}
		}

		const msNow = Date.now().toString();
		const file = getFileOut(msNow);
		await saveFile(emote || urlMatch, file);

		name = trim(name || msNow, 32);

		// Example output: { width: 240, height: 240, type: 'gif' }
		const imgDimensions = sizeOf(file);

		if ((imgDimensions.width && imgDimensions.height) && imgDimensions.width <= 128 && imgDimensions.height <= 128) {
			await saveEmoji(message, emote || urlMatch, name);
		}
		else if (imgDimensions.type) {
			const img = await resizeImage(file, imgDimensions.type, 128, message);
			await saveEmoji(message, img, name);
		}
		deleteImage(file);
	}
}