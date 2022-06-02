import { Command } from "discord-akairo";
import { IKaikiCommandOptions } from "../Interfaces/IKaikiCommandOptions";
import KaikiAkairoClient from "./KaikiAkairoClient";

export default class KaikiCommand extends Command {
    readonly usage?: string | string[];
    client: KaikiAkairoClient;
    subCategory?: string | undefined;

    constructor(id: string, options: IKaikiCommandOptions | undefined) {
        super(id, options);
        this.usage = options?.usage;
        this.subCategory = options?.subCategory;
    }
}

