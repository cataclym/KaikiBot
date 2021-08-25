import { Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { moneyModel } from "../../struct/models";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";

export default class LeaderboardCommand extends KaikiCommand {
	private readonly _money: IMoneyService;
	constructor() {
		super("leaderboard", {
			aliases: ["leaderboard", "lb"],
			description: "",
			usage: "",
		});
		this._money = MongoMoney;
	}

	public async exec(message: Message): Promise<Message> {
		const { currencySymbol } = this._money,
			guildOnlyEntries = (await moneyModel.find({}))
				.filter(e => message.guild?.members.cache.get(e.id))
				.sort((e, o) => o.amount - e.amount)
				.map(e => ({
					user: e.id,
					str: `${e.amount} ${currencySymbol}`,
				})),
			embed = new MessageEmbed()
				.setTitle("Server currency leaderboard"),
			embeds: MessageEmbed[] = [];

		for (let i = 9, p = 0; p < guildOnlyEntries.length; i += 9, p += 9) {

			const emb = new MessageEmbed(embed);

			guildOnlyEntries.slice(p, i).forEach((e) => {
				emb.addField(message.guild?.members.cache.get(e.user)?.user.tag ?? e.user, e.str, true);
			});

			embeds.push(emb);
		}

		return sendPaginatedMessage(message, embeds, {});
	}
}
