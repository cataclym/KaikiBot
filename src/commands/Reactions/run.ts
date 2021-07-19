import { Message } from "discord.js";
import getKawaiiResponseEmbed from "../../lib/APIs/KawaiiAPI";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class Run extends KaikiCommand {
	constructor() {
		super("run", {
			aliases: ["run"],
			description: "Gotta go fast~",
			usage: [""],
			typing: true,
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		const embed = await getKawaiiResponseEmbed(message, "run");

		if (embed) return message.channel.send({ embeds: [embed] });
	}
}
