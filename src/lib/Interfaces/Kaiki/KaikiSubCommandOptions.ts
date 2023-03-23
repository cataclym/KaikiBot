import { SubcommandOptions } from "@sapphire/plugin-subcommands";

export interface KaikiSubCommandOptions extends SubcommandOptions {
    usage?: string | string[],
    subCategory?: string,
}
