import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import logger from "loglevel";
import { birthdayService } from "../lib/AnniversaryRoles";
import { dailyResetTimer, emoteDataBaseService } from "../lib/functions";
import { guildsModel } from "../struct/models";
import { getBotDocument } from "../struct/documentMethods";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
			type: "once",
		});
	}

	public async exec(): Promise<void> {

		(await guildsModel.find({ "settings.dadBot.enabled": true }))
			.forEach(g => {
				const guild = this.client.guilds.cache.get(g.id);
				guild?.commands.create({
					name: "exclude",
					description: "Excludes you from being targeted by dad-bot. Do the command again to reverse this action.",
				})
					.catch(() => logger.warn(`${guild.name} [${g.id}] refused creating slash commands. This is sometimes expected.`));
			});


		logger.info(`Created slash commands in ${this.client.guilds.cache.size} guilds.`);

		dailyResetTimer(this.client)
			.then(async () => {
				logger.info("dailyResetTimer | Reset timer initiated.");
				birthdayService(this.client);
				setTimeout(async () => emoteDataBaseService(this.client)
					.then(i => {
						if (i > 0) {
							logger.info("dataBaseService | " + i + " new emote(s) added!\n");
						}
					}), 2000);
				logger.info("birthdayService | Service initiated");
			});

		logger.info(`dataBaseService | ${await guildsModel.countDocuments()} guilds registered in DB.\n`);

		// Let bot owner know when bot goes online.
		if (["Tsukihi Araragi", "Kaiki Deishū"].includes(this.client.user?.username as string)) {
			await this.client.users.fetch("140788173885276160", { cache: true })
				.then(async user => user
					.send({ embeds:
						[new MessageEmbed()
							.setDescription("Bot is online.")
							.withOkColor()],
					}),
				);
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
