import { Command } from "@cataclym/discord-akairo";
import { Message, GuildMember } from "discord.js";
import sendWaifuPics from "../../nsb/waifuPics";

export default class Yeet extends Command {
	constructor() {
		super("yeet", {
			aliases: ["yeet"],
			description: { description: "Yeeeeeeeeeeeeeeeeeee\neeeeeeeeeeeeeeeet",
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
		return message.channel.send(await sendWaifuPics(message, "yeet", mention));
	}
}