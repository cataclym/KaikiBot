import { Command, Listener } from "@cataclym/discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";

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
					otherwise: (msg: Message) => noArgGeneric(msg),

				},
				{
					id: "member",
					flag: ["-m"],
					type: "member",
					match: "option",
				},
				{
					id: "eventArguments",
					match: "separate",
					default: null,
				},

			],
		});
	}
	public async exec(message: Message, { event, eventArguments, member }: { event: Listener, eventArguments: string[], member: GuildMember }): Promise<Message | void> {

		const value = event.emitter === "client"
			? this.client.emit(event.id, member, eventArguments)
			: this.handler.emit(event.id, member, eventArguments);

		if (value) {
			return message.channel.send(new MessageEmbed({
				description: `Emitted ${event.id}.`,
			}));
		}
	}
}