import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { ColorResolvable, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { hexColorTable, imgFromColor, resolveColor } from "../../lib/Color";
import { KaikiCommand } from "kaiki";
import { Argument, PrefixSupplier } from "discord-akairo";


export default class ColorCommand extends KaikiCommand {
	constructor() {
		super("color", {
			aliases: ["color", "clr"],
			description: "Returns a representation of a color string, or shows list of available color names to use.",
			usage: ["#ff00ff", "list"],
			args: [
				{
					id: "list",
					flag: "list",
					match: "flag",
				},
				{
					id: "color",
					match: "rest",
					type: Argument.union((_, phrase) => hexColorTable[phrase.toLowerCase()], "color"),
					default: null,
				},
			],
		});
	}

	public async exec(message: Message, { color, list }: { color: string | number, list: boolean }): Promise<Message> {

		if (list) {
			const colorList = Object.keys(hexColorTable),
				embedColor = hexColorTable[(colorList[Math.floor(Math.random() * colorList.length)])],
				pages: MessageEmbed[] = [];

			for (let index = 15, p = 0; p < colorList.length; index = index + 15, p = p + 15) {
				pages.push(new MessageEmbed({
					title: "List of all available color names",
					description: colorList.slice(p, index).join("\n"),
					color: embedColor as ColorResolvable,
					footer: { text: `Try ${(this.handler.prefix as PrefixSupplier)(message)}colorlist for a visual representation of the color list` },
				}));
			}

			return sendPaginatedMessage(message, pages, {});
		}

		if (color === null) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle("Please provide a valid hex-color or color name")
					.withErrorColor(message)],
			});
		}

		const clrStr = await resolveColor(String(color).startsWith("#")
				? color.toString()
				: color.toString(16)),
			embed = new MessageEmbed({
				description: clrStr.toString(),
				color: clrStr,
			}),
			attachment = new MessageAttachment(await imgFromColor(clrStr !== "RANDOM" ? clrStr : embed.hexColor ?? "#000000"), "color.png");

		embed.setImage("attachment://color.png");

		return message.channel.send({ files: [attachment],
			embeds: [embed],
		});
	}
}
