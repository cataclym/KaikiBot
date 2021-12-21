import { Message } from "discord.js";
import { dadbotArray } from "../../struct/constants";
import { getUserDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";

// dad bot
export default class dadBot extends KaikiCommand {
	constructor() {
		super("dadbot", {
			channel: "guild",
			editable: false,
			condition: (message: Message) => {
				if (message.guild && message.member && !message.author.bot) {
					if (message.guild.isDadBotEnabled(message) && message.member.hasExcludedRole() && !message.content.includes("||")) {

						for (const item of dadbotArray) {

							const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
							if (r.test(message.content)) {

								let match = message.content.match(r)?.groups?.nickname;
								if (!match) continue;

								const splits = match.split(new RegExp(`${item}`, "mig"));
								if (splits.length > 1) match = splits.reduce((a, b) => a.length <= b.length && a.length > 0 ? a : b);

								if (match.length <= (process.env.DADBOT_MAX_LENGTH || 256)) {
									if (!this.nickname[message.member.id] || this.nickname[message.member.id]?.length > match.length) this.nickname[message.member.id] = match;
								}
							}
						}
						return !!(this.nickname[message.member.id]);
					}
				}
				return false;
			},
		});
	}

	nickname: {
		[id: string]: string
	} = {};

	public async exec(message: Message): Promise<boolean> {

		const nick = this.nickname[message.member!.id];

		message.channel.send({
			content: `Hi, ${nick}`,
			allowedMentions: { parse: ["users"] },
		});

		if (nick.length <= (process.env.DADBOT_NICKNAME_LENGTH || 32)) {
			const user = message.author,
				db = await getUserDocument(user.id);

			db.userNicknames.push(nick);

			if (user.id !== message.guild?.ownerId) {
				// Avoids setting nickname on Server owners
				await message.member?.setNickname(nick);
			}
			db.markModified("userNicknames");
			await db.save();
		}
		return delete this.nickname[message.member!.id];
	}
}
