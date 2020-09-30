const { Listener } = require("discord-akairo");
const { emoteReact, roleCheck, handleMentions, dadBot, tiredNadekoReact, countEmotes } = require("../functions/functions");
const db = require("quick.db");
const guildConfig = new db.table("guildConfig");
let enabledDadBotGuilds = guildConfig.get("dadbot");
async function updateVar(value) {
	enabledDadBotGuilds = value;
}
class MessageListener extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	async exec(message) {
		tiredNadekoReact(message);
		if (message.channel.name !== undefined) {
			// Guild only
			if (message.webhookID || message.author.bot) return;
			countEmotes(message);
			handleMentions(message);
			emoteReact(message);
			if (enabledDadBotGuilds.includes(message.guild.id)) {
				if (!roleCheck(message)) {
					dadBot(message);
				}
			}
		}
	}
}
module.exports = MessageListener;
module.exports.updateVar = updateVar;
