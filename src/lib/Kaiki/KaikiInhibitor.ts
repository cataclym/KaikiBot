import { AkairoMessage, Inhibitor, InhibitorOptions } from "discord-akairo";
import { SyncOrAsync } from "discord-akairo/dist/src/typings/Util";
import { Message } from "discord.js";
import KaikiAkairoClient from "./KaikiAkairoClient";
import KaikiCommand from "./KaikiCommand";

export default class KaikiInhibitor extends Inhibitor {
    client: KaikiAkairoClient;

    constructor(id: string, options?: InhibitorOptions) {
        super(id, options);
    }

    exec(message: Message | AkairoMessage, command: KaikiCommand): SyncOrAsync<boolean> {
        throw new Error("Method not implemented.");
    }
}
