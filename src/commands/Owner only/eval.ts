import { Command } from "discord-akairo";
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
			clientPermissions: "KICK_MEMBERS",
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
	async exec(message: Message, { code }: { code: string }): Promise<Message | void> {
		try {
			let evaled = eval(code);

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