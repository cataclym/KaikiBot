import { Command } from "@sapphire/framework";
import { KaikiCommandOptions } from "../Interfaces/KaikiCommandOptions";
import type KaikiAkairoClient from "./KaikiAkairoClient";

export default class KaikiCommand extends Command {
    readonly usage?: string | string[];
    client: KaikiAkairoClient<true>;

    constructor(context: Command.Context, options: KaikiCommandOptions) {
        super(context, options);
        this.usage = options?.usage;
    }
}
