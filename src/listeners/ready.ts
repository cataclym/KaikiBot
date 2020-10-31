import { Listener } from "discord-akairo";
import { ReAssignBirthdays } from "../functions/AnniversaryRoles";
import { TinderStartup } from "../functions/tinder";
import { DailyResetTimer, EmoteDBStartup, startUp } from "../functions/functions";
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
		EmoteDBStartup(this.client);
		ReAssignBirthdays(this.client);
		// This will spam Console on first boot.
		if (this.client.user) {
			await TinderStartup(this.client.user);
		}

		if (["Tsukihi Araragi", "Kaiki Deishuu"].includes(this.client.user?.username as string)) {
			(await this.client.users.fetch("140788173885276160")).send("I am alive.");
		}
	}
}