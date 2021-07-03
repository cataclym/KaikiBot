import { Message } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class SetNameCommand extends KaikiCommand {
	constructor() {
		super("setname", {
			aliases: ["setname"],
			description: "Assigns the bot a new name/username.",
			usage: "Medusa",
			ownerOnly: true,
			args: [
				{
					id: "name",
					match: "separate",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { name }: { name: string[]}): Promise<Message> {

		const fullName = name.join(" ").substring(0, 32);

		this.client.user?.setUsername(fullName);

		return message.channel.send(`Name set to \`${fullName}\``);
	}
}
