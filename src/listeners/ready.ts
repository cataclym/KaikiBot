import { Listener } from "@cataclym/discord-akairo";
import { MessageEmbed } from "discord.js";
import logger from "loglevel";
import { config } from "../config";
import { birthdayService } from "../lib/AnniversaryRoles";
import { dailyResetTimer, emoteDataBaseService } from "../lib/functions";
import { guildsDB } from "../struct/models";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
			type: "once",
		});
	}

	public async exec(): Promise<void> {

		const presence = this.client.user?.setActivity(config.activityName, { type: config.activityStatus });
		logger.info(`Client ready | Status: ${presence?.status}`);

		this.client.guilds.cache.forEach(g => {
			g.commands.create({
				name: "exclude",
				description: "Excludes you from being targeted by dadbot.",
			});
			logger.info(`Created slash commands in ${g.name}`);
		});

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

		logger.info(`dataBaseService | ${await guildsDB.countDocuments()} guilds registered in DB.\n`);

		// Let bot owner know when bot goes online.
		if (["Tsukihi Araragi", "Kaiki Deishuu"].includes(this.client.user?.username as string)) {
			this.client.users.fetch("140788173885276160")
				.then(user => user
					.send(new MessageEmbed()
						.setDescription("Bot is online.")
						.withOkColor(),
					),
				);
		}
	}
}