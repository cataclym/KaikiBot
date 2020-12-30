import { Command } from "@cataclym/discord-akairo";
import { GuildMember, Message, Util } from "discord.js";
import { config } from "../../config";
import db from "quick.db";
const UserNickTable = new db.table("UserNickTable");

type nickT = {
    [key: string]: string;
} | undefined;
let nick: nickT;

// dad bot
export default class dadBot extends Command {
	constructor() {
		super("dadbot", {
			channel: "guild",
			editable: false,
			condition: (message: Message): boolean => {

				if (message.guild?.isDadBotEnabled() && message.member?.hasExcludedRole()) {
					for (const item of config.prefixes) {

						const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");

						if (r.test(message.content) && !message.author.bot && !message.content.includes("||")) {

							const match = message.content.match(r)?.groups;
							nick = match;
							return (match?.nickname ? true : false);
						}
					}
				}
				return false;
			},
		});
	}

	public async exec(message: Message): Promise<GuildMember | undefined> {

		const match = nick;

		if (match?.nickname && match?.nickname.length <= 256) {
			message.channel.send(`Hi, ${Util.removeMentions(match.nickname)}`);
			// In case of roles being mentionable.
			const owner = message.guild?.owner;
			if (match.nickname.length <= 32) {
				const user = message.author;
				UserNickTable.push(`usernicknames.${user.id}`, match.nickname);
				if (user.id !== owner?.id) {
					// Avoids setting nickname on Server owners
					return message.member?.setNickname(match.nickname);
				}
			}
		}
	}
}
