import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/APIs/waifuPics";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class Cuddle extends KaikiCommand {
	constructor() {
		super("cuddle", {
			aliases: ["cuddle"],
			description: "Cuddle someone!",
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
		return message.channel.send({ embeds: [await sendWaifuPics(message, "cuddle", mention)] });
	}
}

