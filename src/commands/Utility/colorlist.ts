import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import {
	ColorResolvable,
	Message,
	MessageAttachment,
	MessageEmbed,
	MessageOptions,
} from "discord.js";
import { colorTable, hexColorTable, imgFromColor } from "../../lib/Color";
import { KaikiCommand } from "kaiki";


export default class ColorListCommand extends KaikiCommand {
	constructor() {
		super("colorlist", {
			aliases: ["colorlist"],
			description: "Shows a list of all supported color names for the bot",
			typing: true,
			usage: "",
		});
	}

	public async exec(message: Message): Promise<void> {

		let embeds: MessageEmbed[] = [];
		let attachments: MessageAttachment[] = [];
		const messageOptions: MessageOptions[] = [];
		let i = 0;

		for (const color in colorTable) {
			const random = `${Math.random()}`;
			embeds.push(new MessageEmbed()
				.addField(color, `${hexColorTable[color]}\n${colorTable[color]}`)
				.setImage(`attachment://color${random}.png`)
				.setColor(hexColorTable[color] as ColorResolvable),
			);

			attachments.push(new MessageAttachment(await imgFromColor(colorTable[color] as ColorResolvable), `color${random}.png`));

			if (embeds.length === 5) {
				messageOptions.push({
					embeds: embeds,
					files: attachments,
				});
				embeds = [];
				attachments = [];
				i = 0;
				continue;
			}
			i += 1;
		}

		sendPaginatedMessage(message, messageOptions as MessageOptions[], {});
	}
}
