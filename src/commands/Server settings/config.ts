import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiSubCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiSubCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Config from "../../lib/ServerConfig/Config";

@ApplyOptions<KaikiSubCommandOptions>({
    name: "config",
    aliases: ["configure", "conf"],
    description: "Configure or display guild specific settings. Will always respond to default prefix regardless of server prefix.",
    usage: ["", "dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>"],
    requiredUserPermissions: ["ManageMessages"],
    preconditions: ["GuildOnly"],
    subcommands: [
        // Dadbot
        {
            name: "dadbot",
            messageRun: "dadbotRun",
        },
        {
            name: "dad",
            messageRun: "dadbotRun",
        },
        // Anniversaryroles
        {
            name: "anniversary",
            messageRun: "anniversaryRun",
        },
        {
            name: "anniversaryroles",
            messageRun: "anniversaryRun",
        },
        {
            name: "roles",
            messageRun: "anniversaryRun",
        },
        // Prefix
        {
            name: "prefix",
            messageRun: "prefixRun",
        },
        // okColor
        {
            name: "okcolor",
            messageRun: "okcolorRun",
        },
        // errorColor
        {
            name: "errorcolor",
            messageRun: "errorcolorRun",
        },
    ],
})
export default class ConfigCommand extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<Message> {
        return Config.messageRun(message);
    }

    public dadbotRun(message: Message<true>, args: Args) {
        return Config.dadbotRun(message, args);
    }

    public async anniversaryRun(message: Message<true>, args: Args) {
        return Config.anniversaryRun(message, args);
    }

    public async prefixRun(message: Message<true>, args: Args) {
        return Config.prefixRun(message, args);
    }

    public async okcolorRun(message: Message<true>, args: Args) {
        return Config.okcolorRun(message, args);

    }

    public async errorcolorRun(message: Message<true>, args: Args) {
        return Config.errorcolorRun(message, args);
    }
}
