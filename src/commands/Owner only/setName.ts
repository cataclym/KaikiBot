import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";

export default class SetNameCommand extends Command {
	constructor() {
		super("setname", {
			aliases: ["setname"],
			description: { description: "Assigns the bot a new name/username.", usage: "Medusa" },
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