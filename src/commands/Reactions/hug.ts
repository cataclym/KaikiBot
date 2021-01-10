import { Command } from "@cataclym/discord-akairo";
import { Message, GuildMember } from "discord.js";
import sendWaifuPics from "../../nsb/waifuPics";

export default class Hug extends Command {
	constructor() {
		super("hug", {
			aliases: ["hug", "hugs"],
			description: { description: "Hug a good friend, or maybe someone special ;>",
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
		return message.channel.send(await sendWaifuPics(message, "hug", mention));
	}
}