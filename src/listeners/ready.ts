import { Listener } from "discord-akairo";
import { ReAssignBirthdays } from "../functions/AnniversaryRoles";
import { TinderStartup } from "../functions/tinder";
import { DailyResetTimer, EmoteDBStartup, startUp } from "../functions/functions";
import { activityName, activityStatus } from "../config.js";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
		});
	}

	public async exec(): Promise<void> {
		await this.client.user?.setActivity(activityName, { type: activityStatus }).then(r => {
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
	}
}