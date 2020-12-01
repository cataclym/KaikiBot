import { Command, Listener } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import { noArgGeneric } from "../../util/embeds";

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
					otherwise: (msg: Message) => noArgGeneric(msg.util?.parsed?.command),

				},
				{
					id: "eventArguments",
					match: "separate",
				},
			],
		});
	}
	public async exec(message: Message, { event, eventArguments }: { event: Listener, eventArguments: string[] }): Promise<Message | void> {

		const value = this.client.emit(event.id, eventArguments);

		return message.channel.send(new MessageEmbed({
			description: `Emitted ${event.id}.`,
			footer: { text: value.toString() },
		}));
	}
}