import { Message } from "discord.js";
import { KaikiCommand } from "Kaiki";
import { codeblock } from "../../lib/Util";

const clean = (text: string) => {
	return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
};

export default class EvalCommand extends KaikiCommand {
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
	public async exec(message: Message, { code }: { code: string }): Promise<Message | void> {
		try {
			let evaled = await eval("(async () => " + code + ")()");

			if (typeof evaled !== "string") {
				evaled = (await import("util")).inspect(evaled);
			}
			return message.util?.send({
				content: clean(evaled),
				options: { split: true, code:"x1" } });
		}
		catch (err) {
			return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
}
