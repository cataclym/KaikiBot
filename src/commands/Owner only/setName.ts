import { Command } from "discord-akairo";
import { Message } from "discord.js";

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