import { Listener } from "@cataclym/discord-akairo";
import { birthdayService } from "../nsb/AnniversaryRoles";
import { tinderStartupService } from "../nsb/Tinder";
import { DailyResetTimer, emoteDataBaseService, startUp } from "../nsb/functions";
import { config } from "../config";
import { logger } from "../nsb/Logger";

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

		await startUp().then(() => {
			logger.low("emoteDataBaseService | Startup finished.");
		});

		await DailyResetTimer().then(() => {
			logger.low("Reset timer initiated.");
		});

		logger.info("emoteDataBaseService | Checking for new emotes-");
		emoteDataBaseService(this.client).then((i) => {
			logger.low("emoteDataBaseService | ...done! " + (i ?? 0) + " new emotes added!");
		});

		logger.info("birthdayService | Checking dates-");
		birthdayService(this.client).then(() => {
			logger.low();
		});

		// This will spam Console on first boot.
		if (this.client.user) {
			await tinderStartupService(this.client.user).then((i) => {
				logger.low(`tinderStartupService | Tinder has completed startup procedure. | ${i} users registered in Tinder DB`);
			});
		}

		// Let myself know when my bot goes online.
		if (["Tsukihi Araragi", "Kaiki Deishuu"].includes(this.client.user?.username as string)) {
			(await this.client.users.fetch("140788173885276160")).send("Bot is online.");
		}
	}
}