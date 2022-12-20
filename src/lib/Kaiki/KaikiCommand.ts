import { Command } from "discord-akairo";
import { KaikiCommandOptions } from "../Interfaces/KaikiCommandOptions";
import KaikiAkairoClient from "./KaikiAkairoClient";

export default class KaikiCommand extends Command {
    readonly usage?: string | string[];
    client: KaikiAkairoClient<true>;
    subCategory?: string | undefined;

    constructor(id: string, options: KaikiCommandOptions | undefined) {
        super(id, options);
        this.usage = options?.usage;
        this.subCategory = options?.subCategory;
    }
}
