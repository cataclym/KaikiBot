import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";
import { KaikiCommand } from "Kaiki";

export default class Hug extends KaikiCommand {
	constructor() {
		super("hug", {
			aliases: ["hug", "hugs"],
			description: "Hug a good friend, or maybe someone special ;>",
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
		return message.channel.send({ embeds: [await sendWaifuPics(message, "hug", mention)] });
	}
}
