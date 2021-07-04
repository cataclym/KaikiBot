import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import { countEmotes } from "../lib/functions";

export default class MessageListener extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	public async exec(message: Message): Promise<void> {

		if (message.webhookID || message.author.bot || !message.guild) return;

		countEmotes(message);

	}
}
