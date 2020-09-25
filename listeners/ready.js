const { Listener } = require("discord-akairo");
const { ReAssignBirthdays } = require("../functions/AnniversaryRoles");
const { TinderStartup } = require("../functions/tinder");
const { DailyResetTimer, EmoteDBStartup, startUp } = require("../functions/functions");
const { activityName, activityStatus } = require("../config.js");

module.exports = class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
		});
	}

	async exec() {
		await this.client.user.setActivity(activityName, { type: activityStatus }).then(r => {
			console.log(`🟦 Client ready | Status: ${r.status}`);
		});
		await startUp().catch((e) => {
			console.log(e);
		});
		await DailyResetTimer().then(() => {
			console.log("🟩 Reset timer initiated.");
		});
		EmoteDBStartup(this.client).catch((e) => {
			console.log(e);
		});
		ReAssignBirthdays(this.client).catch((e) => {
			console.log(e);
		});
		// This will spam Console on first boot.
		await TinderStartup(this.client.user).catch((e) => {
			console.log(e);
		});
	}
};