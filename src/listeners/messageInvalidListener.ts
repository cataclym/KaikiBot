import { Message } from "discord.js";
import { sendDM, tiredKaikiCryReact } from "../lib/functions";
import KaikiListener from "../lib/Kaiki/KaikiListener";

// const regex = /^[a-z0-9]+$/i;

export default class MessageInvalidListener extends KaikiListener {
    constructor() {
        super("messageInvalid", {
            event: "messageInvalid",
            emitter: "commandHandler",
        });
    }

    public async exec(message: Message): Promise<void> {

        if (message.inGuild()) {
            await this.client.cache.emoteReact(message);
            await tiredKaikiCryReact(message);
        }
        else {
            await sendDM(message);
        }
    }
}
