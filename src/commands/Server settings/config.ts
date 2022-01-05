import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { EmbedFromJson } from "../../interfaces/IGreetLeave";
import { createAndParseWelcomeLeaveMessage } from "../../lib/GreetHandler";
import { KaikiCommand } from "kaiki";
import { getGuildDocument } from "../../struct/documentMethods";

export default class ConfigCommand extends KaikiCommand {
    constructor() {
        super("config", {
            aliases: ["config", "configure", "conf"],
            channel: "guild",
            description: "Configure or display guild specific settings. Will always respond to default prefix.",
            usage: ["", "dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>"],
            prefix: (msg: Message) => {
                const mentions = [`<@${this.client.user?.id}>`, `<@!${this.client.user?.id}>`];
                const prefixes = [(this.handler.prefix as PrefixSupplier)(msg) as string, "-"];
                if (this.client.user) {return [...prefixes, ...mentions];}
                return prefixes;
            },
        });
    }
    *args(): unknown {
        const method = yield {
            type: [
                ["config-dadbot", "dadbot", "dad"],
                ["config-anniversary", "anniversary", "roles", "anniversaryroles"],
                ["config-prefix", "prefix"],
                ["config-okcolor", "okcolor"],
                ["config-errorcolor", "errorcolor"],
            ],
        };
        if (!Argument.isFailure(method)) {
            return Flag.continue(method as string);
        }
    }

    public async exec(message: Message): Promise<Message> {

        if (!message.member) return message;

        const db = await getGuildDocument((message.guild as Guild).id),
            { anniversary, dadBot, prefix, errorColor, okColor, welcome, goodbye } = db.settings,
            welcomeEmbed = await new EmbedFromJson(await createAndParseWelcomeLeaveMessage(welcome, message.member)).createEmbed(),
            goodbyeEmbed = await new EmbedFromJson(await createAndParseWelcomeLeaveMessage(goodbye, message.member)).createEmbed();

        function toggledTernary(value: boolean) {
            return value
                ? "Enabled"
                : "Disabled";
        }

        const pages = [
            new MessageEmbed()
                .withOkColor(message)
                .addField("Dad-bot",
                    toggledTernary(dadBot.enabled), true)
                .addField("Anniversary-Roles",
                    toggledTernary(anniversary), true)
                .addField("Guild prefix",
                    prefix === process.env.PREFIX
                        ? `\`${process.env.PREFIX}\` (Default)`
                        : `\`${prefix}\``, true)
                .addField("Embed error color",
                    errorColor.toString().startsWith("#")
                        ? errorColor.toString()
                        : "#" + errorColor.toString(16), true)
                .addField("Embed ok color",
                    okColor.toString().startsWith("#")
                        ? okColor.toString()
                        : "#" + okColor.toString(16), true)
                .addField("\u200B", "\u200B", true)
                .addField("Welcome message",
                    toggledTernary(welcome.enabled), true)
                .addField("Goodbye message",
                    toggledTernary(goodbye.enabled), true)
                .addField("\u200B", "\u200B", true)
                .addField("Sticky roles",
                    toggledTernary(await this.client.guildSettings.get(message.guild!.id, "stickyRoles", false)), false),
            welcomeEmbed,
            goodbyeEmbed,
        ];

        const categories = Object.entries(db.blockedCategories).filter(e => e[1]);

        if (categories.length) {
            (pages[0] as MessageEmbed)
                .addField("Disabled categories", categories.map(c => c[0]).join("\n"), false);
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
