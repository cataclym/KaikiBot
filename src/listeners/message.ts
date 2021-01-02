import { Listener } from "@cataclym/discord-akairo";
import { emoteReact, tiredNadekoReact, countEmotes } from "../nsb/functions";
import { Message, MessageEmbed } from "discord.js";
import { config } from "../config";
import { standardColor, trim } from "../nsb/Util";
import { logger } from "../nsb/Logger";

export default class MessageListener extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	public async exec(message: Message): Promise<void | Message> {


		let attachmentLinks = "";

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

			logger.info(`message | DM from ${message.author.tag} [${message.author.id}]`);

			const embed = new MessageEmbed({
				color: standardColor,
				author: { name: `${message.author.tag} [${message.author.id}]` },
				description: trim(message.content, 2048),
			});

			// Attachments (Terrible, I know)
			const attachments = message.attachments;

			if (attachments.first()?.url) {

				const urls: string[] = attachments.map(a => a.url);

				const restLinks = [...urls];
				restLinks.shift();
				attachmentLinks = restLinks.join("\n");

				const firstAttachment = attachments.first()?.url as string;

				embed
					.setImage(firstAttachment)
					.setTitle(firstAttachment)
					.setFooter(urls.join("\n"));

			}

			return this.client.users.cache.get(config.ownerID)?.send({ content: attachmentLinks ?? null, embed: embed });
		}
	}
}
