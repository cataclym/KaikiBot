import { Listener } from "discord-akairo";
import { emoteReact, tiredNadekoReact, countEmotes } from "../util/functions";
import { Message, MessageEmbed } from "discord.js";
import { config } from "../config";
import { standardColor } from "../util/Util";

export default class MessageListener extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	public async exec(message: Message): Promise<void | Message> {

		if (message.webhookID || message.author.bot) return;

		tiredNadekoReact(message);

		if (message.channel.type !== "dm") {
			// Guild only
			countEmotes(message);
			emoteReact(message);
		}
		else {
			// I wont wanna see my own msgs, thank u
			if (message.author.id === config.ownerID) return;

			console.log("message | DM from " + message.author.tag);

			const embed = new MessageEmbed({
				color: standardColor,
				author: { name: message.author.tag },
				description: message.content.substring(0, 2048),
			});

			message.attachments.first()?.url ? embed.setImage(message.attachments.first()?.url as string).setTitle(message.attachments.first()?.url as string) : null;

			return this.client.users.cache.get(config.ownerID)?.send(embed);
		}
	}
}
