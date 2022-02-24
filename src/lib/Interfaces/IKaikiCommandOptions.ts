import { CommandOptions } from "discord-akairo";

export interface IKaikiCommandOptions extends CommandOptions {
    usage?: string | string[],
}
