import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { imgFromColor, getColorAsync } from "../../nsb/Color";
import { MessageAttachment } from "discord.js";

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

		const clrStr = await getColorAsync(color);

		return message.channel.send(new MessageAttachment(await imgFromColor(clrStr ?? color)));
	}
}