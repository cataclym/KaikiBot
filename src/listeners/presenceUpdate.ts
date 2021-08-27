import { Listener } from "discord-akairo";
import { ActivityType, Presence } from "discord.js";
import { getBotDocument } from "../struct/documentMethods";

export default class PresenceUpdateListener extends Listener {
	constructor() {
		super("presenceupdate", {
			event: "presenceUpdate",
			emitter: "client",
		});
	}

	public async exec(oldPresence: Presence | null, newPresence: Presence): Promise<void> {
		if (newPresence.user?.id === this.client.user?.id) {
			const db = await getBotDocument();
			if (newPresence.activities[0].type === db.settings.activityType as unknown as ActivityType && newPresence.activities[0].name === db.settings.activity) {
				this.client.user?.setPresence({
					activities: [{
						name: db.settings.activity,
						type: db.settings.activityType,
					}],
				});
			}
		}
	}
}