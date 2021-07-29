import { Message, MessageAttachment } from "discord.js";
import { KaikiCommand } from "kaiki";


export default class GenCmdListCommand extends KaikiCommand {
	constructor() {
		super("gencmdlist", {
			aliases: ["gencmdlist", "gencmdlst"],
			description: "Uploads a JSON file containing all commands.",
			usage: "",
		});
	}

	public async exec(message: Message): Promise<Message> {

		const list = Array.from(this.handler.categories.entries());

		return message.channel.send({
			files: [new MessageAttachment(Buffer.from(JSON.stringify(list, (key, value) =>
				typeof value === "bigint"
					? value.toString()
					: value,
			4,
			), "utf-8"), "cmdlist.json")],
		});
	}
}
