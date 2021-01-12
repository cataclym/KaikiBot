declare module "@cataclym/discord-akairo" {
    export interface CommandOptions {
        description?: StringResolvable | { desciption: string, usage: string | string[] };
    }
}

import { StringResolvable } from "discord.js";