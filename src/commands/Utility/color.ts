import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { imgFromColor, resolveColor } from "../../nsb/Color";
import { MessageEmbed, MessageAttachment } from "discord.js";

export default class ColorCommand extends Command {
	constructor() {
		super("color", {
			aliases: ["color"],
			description: { description: "", usage: "" },
			args: [
				{
					id: "color",
					type: "string",
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}
	public async exec(message: Message, { color }: { color:string }): Promise<Message> {

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