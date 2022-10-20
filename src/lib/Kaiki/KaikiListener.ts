import { Listener, ListenerOptions } from "discord-akairo";
import KaikiAkairoClient from "./KaikiAkairoClient";

export default class KaikiListener extends Listener {

    exec(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    client: KaikiAkairoClient;

    constructor(id: string, options: ListenerOptions) {
        super(id, options);
    }


}
