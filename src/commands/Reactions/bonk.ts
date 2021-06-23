import { Command } from "@cataclym/discord-akairo";
import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";

export default class Bonk extends Command {
	constructor() {
		super("bonk", {
			aliases: ["bonk"],
			description: { description: "When you need to bonk some horny teens",
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
		return message.channel.send({ embeds: [await sendWaifuPics(message, "bonk", mention)] });
	}
}