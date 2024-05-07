import { CommandOptions } from "@sapphire/framework";

export interface KaikiCommandOptions extends CommandOptions {
    usage: string | string[];
    minorCategory?: string;
}
