import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

const clean = (text: string) => {
	if (typeof (text) === "string") {
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	}
	else {
		return text;
	}
};

export default class EvalCommand extends Command {
	constructor() {
		super("eval", {
			aliases: ["eval"],
			ownerOnly: true,
			args: [
				{
					id: "code",
					type: "string",
					match: "rest",
				},
			],
		});
	}
	public async exec(message: Message, { code }: { code: string }): Promise<Message | Message[]> {
		try {
			let evaled = await eval("(async () => " + code + ")()");

			evaled = (await import("util")).inspect(evaled);
			return message.channel.send({
				content: clean(evaled),
				options: { split: true, code:"x1" } });
		}
		catch (err) {
			return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
}
