import { Command, Listener } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

export default class EmitCommand extends Command {
	constructor() {
		super("emit", {
			aliases: ["emit"],
			description: { description: "Emits a specified event. (WIP)", usage: "ratelimit <info about event>" },
			ownerOnly: true,
			args: [
				{
					index: 0,
					id: "event",
					type: "listener",
				},
				{
					id: "eventArguments",
					match: "separate",
				},
			],
		});
	}
	async exec(message: Message, { event, eventArguments }: { event: Listener, eventArguments: string[] }): Promise<Message | void> {

		if (!event) return;

		console.log(eventArguments);

		// process.emit(event);

		const value = this.client.emit(event.id, eventArguments);

		return message.channel.send(new MessageEmbed({
			description: `Emitted ${event.id}.`,
			footer: { text: value.toString() },
		}));
	}
}