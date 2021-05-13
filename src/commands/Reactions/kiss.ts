import { Command } from "@cataclym/discord-akairo";
import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";

export default class Kiss extends Command {
	constructor() {
		super("kiss", {
			aliases: ["kiss", "smooch"],
			description: { description: "OwO 2lood4me",
				usage: ["", "@dreb"] },
			typing: true,
			args: [{
				id: "mention",
				type: "member",
				default: null,
			}],
		});
	}
	public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<Message> {
		return message.channel.send(await sendWaifuPics(message, "kiss", mention));
	}
}