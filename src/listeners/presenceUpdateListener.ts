import { Presence } from "discord.js";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import Constants from "../struct/Constants";

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

            if (!db || !db.Activity || !db.ActivityType) return;

            const acType = Constants.ActivityTypes[db.ActivityType];

            if (newPresence.activities[0].name !== db.Activity || newPresence.activities[0].type !== acType) {
                this.client.user?.setPresence({
                    activities: [
                        {
                            name: db.Activity,
                            type: acType,
                        },
                    ],
                });
            }
        }
    }
}
