import { Listener } from "discord-akairo";
import { emoteReact, tiredNadekoReact, countEmotes } from "../util/functions";
import { Message, MessageEmbed } from "discord.js";
import { config } from "../config";
import { standardColor, trim } from "../util/Util";

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
				description: trim(message.content, 2048),
			});

			const attachments = message.attachments;

			if (attachments.first()?.url) {

				embed.setImage(attachments.first()?.url as string).setTitle(attachments.first()?.url as string);

				const urls: string[] = attachments.map(a => a.url);

				embed.setFooter(urls.join("\n"));

			}

			return this.client.users.cache.get(config.ownerID)?.send(embed);
		}
	}
}
