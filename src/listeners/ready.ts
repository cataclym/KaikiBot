import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import logger from "loglevel";
import { birthdayService } from "../lib/AnniversaryRoles";
import { dailyResetTimer, emoteDataBaseService } from "../lib/functions";
import { guildsModel } from "../struct/models";
import { getBotDocument } from "../struct/documentMethods";
import { excludeData } from "../lib/slashCommands/data";
import chalk from "chalk";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
			type: "once",
		});
	}

	public async exec(): Promise<void> {

		// Find all guilds that have dad-bot enabled
		const enabled = await guildsModel.find({ "settings.dadBot.enabled": true }).exec();

		// Create slash commands in those guilds
		enabled.forEach(g => {
			this.client.guilds.cache.get(g.id)?.commands.create(excludeData)
				// Ignore the unhandled rejection
				.catch(() => null);
		});

		// // Delete slash commands in disabled guilds
		// for (const g1 of [...this.client.guilds.cache.values()]
		// 	.filter(g => !enabledIDs.includes(g.id))) {
		// 	await g1.commands.fetch();
		// 	const cmd = g1.commands.cache.find(c => c.name === "exclude");
		// 	if (!cmd) continue;
		// 	await g1.commands.delete(cmd.id);
		// }

		// Uncommented because of rate-limit

		logger.info(`Created slash commands in ${chalk.green(enabled.length)} guilds.`);

		// What???
		dailyResetTimer(this.client)
			.then(async () => {
				logger.info("dailyResetTimer | Reset timer initiated.");
				// ????
				birthdayService(this.client);
				// ?????????????
				setTimeout(async () => emoteDataBaseService(this.client)
					.then(i => {
						if (i > 0) {
							logger.info(`dataBaseService | ${chalk.green(i)} new emote(s) added!\n`);
						}
					}), 2000);
				logger.info("birthdayService | Service initiated");
			});

		logger.info(`dataBaseService | ${chalk.green(await guildsModel.countDocuments())} guilds registered in DB.\n`);

		// Let bot owner know when bot goes online.
		if (["Tsukihi Araragi#3589", "Kaiki Deishū#9185"].includes(this.client.user?.tag ?? "") && process.env.OWNER) {
			(await this.client.users.cache.get(process.env.OWNER) ?? await this.client.users.fetch(process.env.OWNER, { cache: true }))
				.send({ embeds:
					[new MessageEmbed()
						.setDescription("Bot is online.")
						.withOkColor()],
				});
		}

		const botDb = await getBotDocument();
		this.client.user?.setPresence({
			activities: [{
				name: botDb.settings.activity,
				type: botDb.settings.activityType,
			}],
		});
	}
}
