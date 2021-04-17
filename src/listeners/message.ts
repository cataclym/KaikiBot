import { Listener } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
import logger from "loglevel";
import { config } from "../config";
import { countEmotes, emoteReact, tiredNadekoReact } from "../nsb/functions";
import { trim } from "../nsb/Util";


let botOwner: User | undefined;

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
			if (message.author.id === config.ownerID) return;
			// I wont wanna see my own msgs, thank u

			else if (!botOwner) botOwner = this.client.users.cache.get(config.ownerID);

			let attachmentLinks = "";
			logger.info(`message | DM from ${message.author.tag} [${message.author.id}]`);

			const embed = new MessageEmbed({
				author: { name: `${message.author.tag} [${message.author.id}]` },
				description: trim(message.content, 2048),
			})
				.withOkColor();

			// Attachments (Terrible, I know)
			const { attachments } = message;

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

			return botOwner?.send({ content: attachmentLinks ?? null, embed: embed });
		}
	}
}
