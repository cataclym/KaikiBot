import { Listener } from "@cataclym/discord-akairo";
import { birthdayService } from "../nsb/AnniversaryRoles";
import { tinderStartupService } from "../nsb/Tinder";
import { dailyResetTimer, dbColumns, emoteDataBaseService } from "../nsb/functions";
import { config } from "../config";
import { logger } from "../nsb/Logger";
import { MessageEmbed } from "discord.js";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
		});
	}

	public async exec(): Promise<void> {

		if (!config.prefix) {
			throw new Error("Missing prefix! Set a prefix in src/config.ts");
		}

		await this.client.user?.setActivity(config.activityName, { type: config.activityStatus }).then(r => {
			logger.info(`Client ready | Status: ${r.status}`);
		});

		await dailyResetTimer().then(() => {
			logger.low("Reset timer initiated.");
		});

		logger.info("dataBaseService | Checking for missing database entries");

		dbColumns(this.client).then(async (guilds) => {
			logger.low(`dataBaseService | ${guilds.size} guilds registered in DB.`);
		});

		emoteDataBaseService(this.client).then(async (i) => {
			logger.low("dataBaseService | " + i + " new emotes added!");
		});

		logger.info("birthdayService | Checking dates");

		birthdayService(this.client);

		// This will spam Console on first boot.
		if (this.client.user) {
			await tinderStartupService(this.client.user).then((i) => {
				logger.low(`tinderStartupService | Tinder has completed startup procedure. | ${i} users registered in Tinder DB`);
			});
		}

		// Let myself know when my bot goes online.
		if (["Tsukihi Araragi", "Kaiki Deishuu"].includes(this.client.user?.username as string)) {
			(await this.client.users.fetch("140788173885276160")).send(new MessageEmbed().setDescription("Bot is online."));
		}
	}
}