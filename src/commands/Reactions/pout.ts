import { Message } from "discord.js";
import getKawaiiResponseEmbed from "../../lib/APIs/KawaiiAPI";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class Pout extends KaikiCommand {
	constructor() {
		super("pout", {
			aliases: ["pout"],
			description: "I am not angry, b-baka",
			usage: [""],
			typing: true,
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		const embed = await getKawaiiResponseEmbed(message, "pout");

		if (embed) return message.channel.send({ embeds: [embed] });
	}
}
