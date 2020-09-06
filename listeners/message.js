const { Listener } = require("discord-akairo");
const { emoteReact, roleCheck, handleMentions, dadBot, tiredNadekoReact, countEmotes } = require("../functions/functions");

module.exports = class Message extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	async exec(message) {
		await tiredNadekoReact(message);
		if (message.channel.name !== undefined) {
			// Guild only
			if (message.webhookID || message.author.bot) return;
			await countEmotes(message);
			await handleMentions(message);
			await emoteReact(message);
			if (!roleCheck(message)) {
				await dadBot(message);
			}
		}
	}
};