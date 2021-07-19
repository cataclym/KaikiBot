import { GuildMember, Message } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import getPurrBotResponseEmbed from "../../lib/APIs/PurrBot";

export default class Bite extends KaikiCommand {
	constructor() {
		super("bite", {
			aliases: ["bite"],
			description: "Bite someone >:)",
			usage: [""],
			typing: true,
			args: [{
				id: "mention",
				type: "member",
				default: null,
			}],
		});
	}

	public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<Message> {
		return message.channel.send({ embeds: [await getPurrBotResponseEmbed(message, "bite", mention)],
		});
	}
}
