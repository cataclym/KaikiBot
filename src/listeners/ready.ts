import { Listener } from "discord-akairo";
import { birthdayService } from "../util/AnniversaryRoles";
import { tinderStartupService } from "../util/tinder";
import { DailyResetTimer, emoteDataBaseService, startUp } from "../util/functions";
import { config } from "../config";

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
			console.log(`🟦 Client ready | Status: ${r.status}`);
		});

		await startUp();
		await DailyResetTimer().then(() => {
			console.log("🟩 Reset timer initiated.");
		});

		emoteDataBaseService(this.client);
		birthdayService(this.client);

		// This will spam Console on first boot.
		if (this.client.user) {
			await tinderStartupService(this.client.user);
		}

		// Let myself know when my bot goes online.
		if (["Tsukihi Araragi", "Kaiki Deishuu"].includes(this.client.user?.username as string)) {
			(await this.client.users.fetch("140788173885276160")).send("Bot is online.");
		}
	}
}