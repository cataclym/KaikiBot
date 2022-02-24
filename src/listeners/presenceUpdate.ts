import { Presence } from "discord.js";
import KaikiListener from "Kaiki/KaikiListener";

export default class PresenceUpdateListener extends KaikiListener {
    constructor() {
        super("presenceupdate", {
            event: "presenceUpdate",
            emitter: "client",
        });
    }

    public async exec(oldPresence: Presence | null, newPresence: Presence): Promise<void> {
        if (newPresence.user?.id === this.client.user?.id) {
            const db = await this.client.orm.botSettings.findFirst({});
            if (!db || !db.Activity) return;

            if (newPresence.activities[0].type !== db.ActivityType || newPresence.activities[0].name !== db.Activity) {
                this.client.user?.setPresence({
                    activities: [{
                        name: db.Activity || undefined,
                        type: db.ActivityType || undefined,
                    }],
                });
            }
        }
    }
}
