import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

export default class HentaiCommand extends Command {
	constructor() {
		super("hentai", {
			aliases: ["hentai"],
		});
	}
	public async exec(message: Message) : Promise<Message | void> {
		try {
			if (message.channel.type === "text" && message.channel.nsfw) {
				return message.util?.send(new MessageEmbed({
					description: "",
					title: "",
					color: await getMemberColorAsync(message),
				}));
			}
			else {
				throw "Channel is not NSFW.";
			}
		}
		catch (e) {
			return console.error(e);
		}
	}
}