import { Guild } from "discord.js";
import { JSONToMessageOptions } from "../lib/GreetHandler";
import { HentaiTypes } from "../lib/Hentai/HentaiService";
import KaikiCommand from "../lib/Kaiki/KaikiCommand";
import { KaikiColor } from "../lib/Types/KaikiColor";
import { Categories } from "../lib/Types/Miscellaneous";

declare module "@sapphire/framework" {
    interface Preconditions {
        OwnerOnly: never;
    }

    interface ArgType {
        category: Categories;
        color: KaikiColor;
        command: KaikiCommand;
        emoteImage: string;
        guild: Guild;
        kaikiCoin: string;
        kaikiHentaiTypes: HentaiTypes;
        kaikiMoney: bigint;
        welcomeGoodbyeMessage: JSONToMessageOptions;
    }
}
