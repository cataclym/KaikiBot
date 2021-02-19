import { MessageEmbed, Message, User } from "discord.js";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "@cataclym/discord-akairo";
import { getUserDB } from "../../struct/db";
import { IUser } from "../../interfaces/db";

export default class NamesCommand extends Command {
	constructor() {
		super("names", {
			aliases: ["name", "names"],
			description: { description: "Returns all your daddy nicknames", usage: "@dreb" },
		});
	}
	*args(): Generator<{
		type: (message: Message, phrase: string) => Promise<boolean>;
		index?: undefined;
	} | {
		index: number;
		type: string;
	}, {
		unionUser: unknown;
		method: unknown;
	}, unknown> {
		const method = yield {
			// TODO: figure out type of phrase
			type: async (message: Message, phrase: string) => {
				return (["remove", "rem", "delete", "del"].includes(phrase));
			},
		};
		const unionUser = yield {
			index: 0,
			type: "user",
		};

		return { unionUser, method };
	}

	public async exec(message: Message, { method, unionUser }: { method: boolean, unionUser: User }): Promise<IUser | Message | void> {

		if (!(message.content.trim().split(/ +/).length > 1) && !unionUser) {
			return;
		}

		const db = await getUserDB(message.author.id);

		if (method) {
			db.userNicknames = [];
			message.channel.send(new MessageEmbed()
				.setDescription(`Deleted all of <@${message.author.id}>'s nicknames.\nWell done, you made daddy forget.`)
				.withOkColor(message),
			);
			db.markModified("userNicknames");
			return db.save();
		}

		if (unionUser) {
			const nicknameString = db.userNicknames.join(", "),
				pages = [];

			for (let i = 2048, p = 0; p < nicknameString.length; i += 2048, p += 2048) {
				pages.push(new MessageEmbed()
					.setTitle(`${unionUser.username}'s past names`)
					.setThumbnail(unionUser.displayAvatarURL({ dynamic: true }))
					.setDescription(nicknameString.slice(p, i))
					.withOkColor(message),
				);
			}
			return editMessageWithPaginatedEmbeds(message, pages, {});
		}
	}
}
