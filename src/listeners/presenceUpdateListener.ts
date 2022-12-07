import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class PresenceUpdateListener extends KaikiListener {
    constructor() {
        super("presenceupdate", {
            event: "presenceUpdate",
            emitter: "client",
        });
    }

    exec() {
        return;
    }
}
