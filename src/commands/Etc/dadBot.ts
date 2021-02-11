import { Command } from "@cataclym/discord-akairo";
import { Guild, GuildMember, Message, Util } from "discord.js";
import { getUserDB } from "../../struct/db";
import { config } from "../../config";
import { logger } from "../../nsb/Logger";

let nick: {
	[key: string]: string
};

// dad bot
export default class dadBot extends Command {
	constructor() {
		super("dadbot", {
			channel: "guild",
			editable: false,
			condition: (message: Message): boolean => {

				if ((message.guild as Guild).isDadBotEnabled() && (message.member as GuildMember).hasExcludedRole() && !message.author.bot) {
					for (const item of config.prefixes) {

						const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");

						if (r.test(message.content) && !message.content.includes("||")) {

							const match = message.content.match(r)?.groups;

							if (match?.nickname && match?.nickname.length <= 256) {
								nick = match;
								return true;
							}
							return false;
						}
					}
				}
				return false;
			},
		});
	}

	public async exec(message: Message): Promise<GuildMember | undefined> {

		message.channel.send(`Hi, ${Util.removeMentions(nick.nickname)}`);

		if (nick.nickname.length <= 32) {

			const user = message.author;

			(await getUserDB(user.id)).updateOne({ $push: { userNicknames: nick.nickname } }, null, (err, data) => logger.info(data));

			if (user.id !== message.guild?.owner?.id) {
				// Avoids setting nickname on Server owners
				return message.member?.setNickname(nick.nickname);
			}
		}
	}
}
