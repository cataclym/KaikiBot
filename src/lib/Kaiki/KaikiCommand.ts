import { Args, Command, CommandOptions } from "@sapphire/framework";
import KaikiCommandOptions from "../Interfaces/Kaiki/KaikiCommandOptions";
import type KaikiSapphireClient from "./KaikiSapphireClient";

export default class KaikiCommand extends Command<Args, CommandOptions> {
    readonly usage: string | string[];
    client: KaikiSapphireClient<true>;
    minorCategory: string | undefined;

    constructor(context: Command.LoaderContext, options: KaikiCommandOptions) {
        super(context, options);
        this.minorCategory = options.minorCategory;
        this.usage = options.usage;
        this.client = this.container.client as KaikiSapphireClient<true>;
    }
}
