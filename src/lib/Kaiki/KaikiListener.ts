import { AkairoMessage, Listener, ListenerOptions } from "discord-akairo";
import { SyncOrAsync } from "discord-akairo/dist/src/typings/Util";
import { Message } from "discord.js";
import KaikiAkairoClient from "./KaikiAkairoClient";
import KaikiCommand from "./KaikiCommand";

export default class KaikiListener extends Listener {
    client: KaikiAkairoClient;
    exec: (message: Message | AkairoMessage, command?: KaikiCommand) => SyncOrAsync<boolean>;

    constructor(id: string, options: ListenerOptions) {
        super(id, options);
    }
}
