import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { Message, MessageEmbed, User } from "discord.js";
import { IUser } from "../../interfaces/IDocuments";
import { getUserDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";


async function add(Embed: MessageEmbed, array: MessageEmbed[]) {
	array.push(Embed);
}

export default class NamesCommand extends KaikiCommand {
	constructor() {
		super("names", {
			aliases: ["name", "names"],
			description: "Returns all your daddy nicknames",
			usage: "@dreb",
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

		if (method) {
			const db = await getUserDocument(message.author.id);
			db.userNicknames = [];
			message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`Deleted all of <@${message.author.id}>'s nicknames.\nWell done, you made daddy forget.`)
					.withOkColor(message)],
			});
			db.markModified("userNicknames");
			return db.save();
		}

		if (!unionUser) {
			unionUser = message.author;
		}

		const db = await getUserDocument(unionUser.id),
			nicknameString = (db.userNicknames.length ? db.userNicknames : ["Empty"]).join(", "),
			pages: MessageEmbed[] = [];

		for (let i = 2048, p = 0; p < nicknameString.length; i += 2048, p += 2048) {
			await add(new MessageEmbed()
				.setTitle(`${unionUser.username}'s past names`)
				.setThumbnail(unionUser.displayAvatarURL({ dynamic: true }))
				.setDescription(nicknameString.slice(p, i))
				.withOkColor(message),
			pages);
		}

		return sendPaginatedMessage(message, pages, {});
	}
}
