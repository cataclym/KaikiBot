import { CommandOptions } from "discord-akairo";

export interface KaikiCommandOptions extends CommandOptions {
    usage?: string | string[],
    subCategory?: string,
}
