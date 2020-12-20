import { GuildMember, MessageEmbed, Message, User } from "discord.js";
import { UserNickTable } from "../../util/functions";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "discord-akairo";
const arr = ["remove", "rem", "delete", "del"];

module.exports = class NamesCommand extends Command {
	constructor() {
		super("names", {
			aliases: ["name", "names"],
			description: { description: "Returns all your daddy nicknames", usage: "@dreb" },
		});
	}
	*args() {
		const method = yield {
			// TODO: figure out type of phrase
			type: async (message: Message, phrase: string) => {
				if (arr.includes(phrase)) {
					return true;
				}
			},
		};
		const unionUser = yield {
			index: 0,
			type: "user",
		};

		return { unionUser, method };
	}

	public async exec(message: Message, { method, unionUser }: { method: boolean, unionUser: User}) {
		const color = await (message.member as GuildMember).getMemberColorAsync();
		const user = !(message.content.trim().split(/ +/).length > 1) && !unionUser ? message.author : unionUser;

		if (method) {
			try {
				if (UserNickTable.delete(`usernicknames.${message.member?.id}`)) {

					UserNickTable.push(`usernicknames.${message.member?.id}`, message.author.username);
					return message.util?.send(`Deleted all of ${message.member}'s nicknames.\nWell done, you made daddy forget.`);
				}
			}
			catch (error) {
				return console.log(error);
			}
		}

		if (user) {
			if (!UserNickTable.has(`usernicknames.${user.id}`)) {
				UserNickTable.push(`usernicknames.${user.id}`, user.username);
			}

			let AuthorDBName = UserNickTable.fetch(`usernicknames.${user.id}`);
			AuthorDBName = [...new Set(AuthorDBName)];

			// Makes it look cleaner
			let StringsAuthorDBName = AuthorDBName.join("¤").toString();
			StringsAuthorDBName = StringsAuthorDBName.replace(/¤/g, ", ");

			const pages = [];
			for (let i = 2048, p = 0; p < StringsAuthorDBName.length; i = i + 2048, p = p + 2048) {
				pages.push(new MessageEmbed()
					.setTitle(`${user.username}'s past names`)
					.setColor(color)
					.setThumbnail(user.displayAvatarURL({ dynamic: true }))
					.setDescription(StringsAuthorDBName.slice(p, i)));
			}
			return editMessageWithPaginatedEmbeds(message, pages, {});
		}
	}
};
