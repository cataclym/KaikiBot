import { CommandOptions } from "@sapphire/framework";

export default interface KaikiCommandOptions extends CommandOptions {
    usage: string | string[];
    minorCategory?: string;
}
