import { Command } from "@cataclym/discord-akairo";
import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../nsb/waifuPics";

export default class Nom extends Command {
	constructor() {
		super("nom", {
			aliases: ["nom"],
			description: { description: "Nom someone, cus you're hungry",
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
		return message.channel.send(await sendWaifuPics(message, "nom", mention));
	}
}