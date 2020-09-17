const { Listener } = require("discord-akairo");
const { ReAssignBirthdays } = require("../functions/AnniversaryRoles");
const { TinderStartup } = require("../functions/tinder");
const { DailyResetTimer, EmoteDBStartup } = require("../functions/functions");
const { activityName, activityStatus } = require("../config.js");

module.exports = class Ready extends Listener {
	constructor() {
		super("ready", {
			event: "ready",
			emitter: "client",
		});
	}

	async exec() {
		console.time("Anniversary roles");
		await this.client.user.setActivity(activityName, { type: activityStatus }).then(r => {
			console.log(`🟦 Client ready | Status: ${r.status}`);
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