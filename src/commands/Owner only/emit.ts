import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

export default class EmitCommand extends Command {
	constructor() {
		super("emit", {
			aliases: ["emit"],
			description: { description: "Emits a specified event", usage: "ratelimit" },
		});
	}
	async exec(message: Message, { event }: { event: string }): Promise<Message> {

		// process.emit(event);

		const value = this.client.emit(event);

		return message.channel.send(new MessageEmbed({
			description: `Emitted ${event}.`,
			footer: { text: value.toString() },
		}));


	}
}