import { Listener } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { countEmotes, emoteReact, sendDM, tiredNadekoReact } from "../lib/functions";

export default class MessageListener extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	public async exec(message: Message): Promise<void> {

		if (message.webhookID || message.author.bot) return;

		tiredNadekoReact(message);

		if (message.channel.type !== "dm") {
			// Guild only
			countEmotes(message);
			emoteReact(message);
		}

		else {
			sendDM(message);
		}
	}
}
