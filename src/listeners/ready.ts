import { Listener } from "@cataclym/discord-akairo";
import { MessageEmbed } from "discord.js";
import logger from "loglevel";
import { config } from "../config";
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

		if (!config.prefix) {
			throw new Error("Missing prefix! Set a prefix in src/config.ts");
		}

		const presence = this.client.user?.setActivity(config.activityName, { type: config.activityStatus });
		logger.info(`Client ready | Status: ${presence?.status}`);

		this.client.guilds.cache.forEach(g => {
			g.commands.create({
				name: "exclude",
				description: "Excludes you from being targeted by dadbot.",
			});
			logger.info(`Created slash commands in ${g.name}`);
		});

		dailyResetTimer()
			.then(() => {
				logger.info("dailyResetTimer | Reset timer initiated.");
				logger.info("birthdayService | Service initiated");
			});

		setTimeout(async () => {
			await emoteDataBaseService(this.client)
				.then(i => {
					if (i > 0) {
						logger.info("dataBaseService | " + i + " new emote(s) added!\n");
					}
				});
		}, 2000);

		const guilds = await guildsDB.countDocuments();
		logger.info(`dataBaseService | ${guilds} guilds registered in DB.\n`);

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