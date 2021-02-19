import { Command } from "@cataclym/discord-akairo";
import { GuildMember, Message, Util } from "discord.js";
import { getUserDB } from "../../struct/db";
import { config } from "../../config";
import { IUser } from "../../interfaces/db";

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

				if (message.guild?.isDadBotEnabled() && (message.member as GuildMember).hasExcludedRole() && !message.author.bot) {
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

	public async exec(message: Message): Promise<IUser | void> {

		message.channel.send(`Hi, ${Util.removeMentions(nick.nickname)}`);

		if (nick.nickname.length <= 32) {

			const user = message.author,
				db = await getUserDB(user.id);

			db.userNicknames.push(nick.nickname);

			if (user.id !== message.guild?.owner?.id) {
				// Avoids setting nickname on Server owners
				message.member?.setNickname(nick.nickname);
			}
			db.markModified("userNicknames");
			return db.save();
		}
	}
}
