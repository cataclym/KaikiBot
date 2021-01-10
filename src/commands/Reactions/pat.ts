import { Command } from "@cataclym/discord-akairo";
import { Message, GuildMember } from "discord.js";
import sendWaifuPics from "../../nsb/waifuPics";

export default class Pat extends Command {
	constructor() {
		super("pat", {
			aliases: ["pat"],
			description: { description: "Pat a cat!\nOr a guildmember...",
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
		return message.channel.send(await sendWaifuPics(message, "pat", mention));
	}
}