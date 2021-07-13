import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/APIs/waifuPics";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class Lick extends KaikiCommand {
	constructor() {
		super("lick", {
			aliases: ["lick"],
			description: "Lick someone... I guess...?",
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
		return message.channel.send({ embeds: [await sendWaifuPics(message, "lick", mention)] });
	}
}
