import { Listener } from "@cataclym/discord-akairo";
import { birthdayService } from "../nsb/AnniversaryRoles";
import { dailyResetTimer, emoteDataBaseService } from "../nsb/functions";
import { config } from "../config";
import { logger } from "../nsb/Logger";
import { MessageEmbed } from "discord.js";
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

		this.client.user?.setActivity(config.activityName, { type: config.activityStatus })
			.then(r => {
				logger.info(`Client ready | Status: ${r.status}`);
			});

		dailyResetTimer()
			.then(() => {
				logger.low("dailyResetTimer | Reset timer initiated.");
			});

		setTimeout(async () => {
			await emoteDataBaseService(this.client)
				.then(i => {
					console.log("final", i);
					if (i > 0) {
						logger.low("dataBaseService | " + i + " new emotes added!");
					}
				});
		}, 2000);

		await birthdayService(this.client);
		logger.info("birthdayService | Service initiated");

		const guilds = await guildsDB.countDocuments();
		logger.low(`dataBaseService | ${guilds} guilds registered in DB.`);

		// Let bot owner know when bot goes online.
		if (["Tsukihi Araragi", "Kaiki Deishuu"].includes(this.client.user?.username as string)) {
			this.client.users.fetch("140788173885276160").then(user => user
				.send(new MessageEmbed()
					.setDescription("Bot is online.")
					.withOkColor(),
				),
			);
		}
	}
}