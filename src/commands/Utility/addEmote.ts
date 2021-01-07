import { Argument, Command } from "@cataclym/discord-akairo";
import { Message, MessageAttachment } from "discord.js";
import sizeOf from "image-size";
import { noArgGeneric } from "../../nsb/Embeds";
import { deleteImage, getFileOut, getFilesizeInBytes, resizeImage, saveEmoji, saveFile } from "../../nsb/Emote";
import { trim } from "../../nsb/Util";

const emoteRegex = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
export default class AddEmoteCommand extends Command {
	constructor() {
		super("addemote", {
			aliases: ["addemote", "ae"],
			description: { description: "Adds an emote from an image link or attached image, with an optional name.", usage: "https://discord.com/assets/28174a34e77bb5e5310ced9f95cb480b.png DiscordLogo" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			typing: true,
			channel: "guild",
			args: [
				{
					id: "url",
					type: Argument.union(imgRegex, emoteRegex, (m: Message) => {
						if (m.attachments.first()) {
							return m.attachments.first();
						}
					}),
					otherwise: (m: Message) => noArgGeneric(m),
				},
				{
					id: "name",
					type: Argument.union((m: Message) => {
						if (!!m.attachments.first() && !!m.args(this)) {
							return m.args(this);
						}
					}, "string"),
					match: "rest",
				},
			],
		});
	}
	public async exec(message: Message, { url, name }: { url: { match: RegExpMatchArray, matches: [][] } | MessageAttachment, name: string | null | undefined }): Promise<Message | void> {

		let emote, urlMatch;

		if (!(url instanceof MessageAttachment)) {
			urlMatch = url.match[0].toString();

			if (urlMatch.startsWith("<") && urlMatch.endsWith(">")) {

				const emoteID = urlMatch.match(/\d+/g);

				if (emoteID) {
					emote = `https://cdn.discordapp.com/emojis/${emoteID.toString()}.${urlMatch.indexOf("a") === 1 ? "gif" : "png"}`;
					name = name ?? urlMatch.slice(2, urlMatch.lastIndexOf(":")).replace(":", "");
				}
			}
			else {
				emote = urlMatch;
			}
		}
		else {
			emote = url.url || url.proxyURL;
			name = name || url.name?.slice(0, url.name.lastIndexOf("."));
		}

		if (!emote) return;

		const msNow = Date.now().toString();
		const file = getFileOut(msNow);

		name = trim(name || msNow, 32).replace(/ /g, "_");
		await saveFile(emote, file);

		// Example output: { width: 240, height: 240, type: 'gif' }
		const imgDimensions = sizeOf(file),
			fileSize = await getFilesizeInBytes(file);

		// Had to add filesizeCheck
		if ((imgDimensions.width && imgDimensions.height) && imgDimensions.width <= 128 && imgDimensions.height <= 128 && !(fileSize > 25600)) {
			await saveEmoji(message, emote, name);
		}

		else if (imgDimensions.type) {
			const img = await resizeImage(file, imgDimensions.type, 128, message);
			await saveEmoji(message, img, name);
		}
		deleteImage(file);
	}
}