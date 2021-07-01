import { Command } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import { hexColorTable, imgFromColor, resolveColor } from "../../lib/Color";
import { noArgGeneric } from "../../lib/Embeds";

export default class ColorCommand extends Command {
	constructor() {
		super("color", {
			aliases: ["color", "clr"],
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
					match: "rest",
				},

			],
		});
	}
	public async exec(message: Message, { color, list }: { color: string, list: boolean }): Promise<Message> {

		if (list) {
			const colorList = Object.keys(hexColorTable),
				embedColor = hexColorTable[(colorList[Math.floor(Math.random() * colorList.length)])],
				pages: MessageEmbed[] = [];

			for (let index = 15, p = 0; p < colorList.length; index = index + 15, p = p + 15) {
				pages.push(new MessageEmbed({
					title: "List of all available color names",
					description: colorList.slice(p, index).join("\n"),
					color: embedColor,
				}));
			}

			return editMessageWithPaginatedEmbeds(message, pages, {});
		}

		if (typeof color != "string") {
			return message.channel.send({ embeds: [noArgGeneric(message)] });
		}

		// Someone pls format this better ty^^

		const clrStr = await resolveColor(color),
			embed = new MessageEmbed({
				description: clrStr.toString(),
				color: clrStr,
			}),
			attachment = new MessageAttachment(await imgFromColor(clrStr !== "RANDOM" ? clrStr : embed.hexColor ?? "#000000"), "color.png");

		if (clrStr === "RANDOM") embed.setDescription(embed.hexColor?.toString() ?? "null");

		embed.setImage("attachment://color.png");

		return message.channel.send({ files: [attachment],
			embeds: [embed],
		});
	}
}
