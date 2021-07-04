import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class Yeet extends KaikiCommand {
	constructor() {
		super("yeet", {
			aliases: ["yeet"],
			description: "Yeeeeeeeeeeeeeeeeeee\neeeeeeeeeeeeeeeet",
			usage: ["", "@dreb"],
			typing: true,
			args: [{
				id: "mention",
				type: "member",
				default: null,
			}],
		});
	}

	public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<Message> {
		return message.channel.send({ embeds: [await sendWaifuPics(message, "yeet", mention)] });
	}
}
