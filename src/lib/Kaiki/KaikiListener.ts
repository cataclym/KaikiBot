import { Listener } from "@sapphire/framework";
import KaikiAkairoClient from "./KaikiAkairoClient";

export default class KaikiListener extends Listener {
    client: KaikiAkairoClient<true>;

    run(...args: any): any {
        return undefined;
    }
}
