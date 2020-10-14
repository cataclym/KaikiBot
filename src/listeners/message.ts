import { Listener } from "discord-akairo";
import { emoteReact, roleCheck, handleMentions, dadBot, tiredNadekoReact, countEmotes } from "../functions/functions";
import { Message } from "discord.js";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const guildConfig = new db.table("guildConfig");
let enabledDadBotGuilds = guildConfig.get("dadbot");
export async function updateVar(value: string[]): Promise<void> {
	enabledDadBotGuilds = value;
}
export default class MessageListener extends Listener {
	constructor() {
		super("message", {
			event: "message",
			emitter: "client",
		});
	}

	public async exec(message: Message): Promise<void> {

		tiredNadekoReact(message);
		if (message.channel.type !== "dm") {
			// Guild only
			if (message.webhookID || message.author.bot) return;
			countEmotes(message);
			handleMentions(message);
			emoteReact(message);
			if (enabledDadBotGuilds?.includes(message.guild?.id)) {
				if (await roleCheck(message)) {
					dadBot(message);
				}
			}
		}
	}
}
