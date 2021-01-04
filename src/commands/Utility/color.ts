import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { imgFromColor, resolveColor, colorTable, getColorAsync } from "../../nsb/Color";
import { MessageEmbed, MessageAttachment } from "discord.js";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";

export default class ColorCommand extends Command {
	constructor() {
		super("color", {
			aliases: ["color"],
			description: {
				description: "Returns a representation of a color string, or shows list of available color names to use.",
				usage: ["", "list"],
			},
			args: [
				{
					id: "list",
					flag: "list",
					match: "flag",
				},
				{
					id: "color",
					type: "string",
				},

			],
		});
	}
	public async exec(message: Message, { color, list }: { color: string, list: boolean }): Promise<Message> {

		if (list) {
			const colorList = Object.keys(colorTable),
				embedColor = await getColorAsync(colorList[Math.floor(Math.random() * colorList.length)]) ?? message.getMemberColorAsync(),
				map = colorList.map((k, v) => k),
				pages: MessageEmbed[] = [];

			for (let index = 15, p = 0; p < map.length; index = index + 15, p = p + 15) {
				pages.push(new MessageEmbed({
					title: "List of all available color names",
					description: map.slice(p, index).join("\n"),
					color: await embedColor,
				}));
			}

			return editMessageWithPaginatedEmbeds(message, pages, {});
		}

		if (typeof color != "string") {
			return message.channel.send(noArgGeneric(message));
		}

		const clrStr = await resolveColor(color),
			attachment = new MessageAttachment(await imgFromColor(clrStr), "color.png");

		return message.channel.send({ files: [attachment],
			embed: new MessageEmbed({
				description: clrStr.toString(),
				image: { url: "attachment://color.png" },
				color: clrStr,
			}),
		});
	}
}