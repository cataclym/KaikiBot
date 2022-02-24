import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed, MessageOptions } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import GreetHandler from "../../lib/GreetHandler";
import { blockedCategories } from "../../struct/constants";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

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
                if (this.client.user) {
                    return [...prefixes, ...mentions];
                }
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

        const db = await this.client.orm.guilds.findUnique({ where: { Id: BigInt(message.guild!.id) }, include: { BlockedCategories: true } });
        if (!db) return await message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, "No data for this guild was stored in the database!")] });

        const { Anniversary, DadBot, Prefix, ErrorColor, OkColor, WelcomeChannel, ByeChannel } = db;

        const pages: (MessageEmbed | MessageOptions)[] = [
            new MessageEmbed()
                .withOkColor(message)
                .addField("Dad-bot",
                    Utility.toggledTernary(DadBot), true)
                .addField("Anniversary-Roles",
                    Utility.toggledTernary(Anniversary), true)
                .addField("Guild prefix",
                    Prefix === process.env.PREFIX
                        ? `\`${process.env.PREFIX}\` (Default)`
                        : `\`${Prefix}\``, true)
                .addField("Embed ok color",
                    OkColor.toString(16), true)
                .addField("Embed error color",
                    ErrorColor.toString(16), true)
                .addField("\u200B", "\u200B", true)
                .addField("Welcome message",
                    Utility.toggledTernary(!!WelcomeChannel), true)
                .addField("Goodbye message",
                    Utility.toggledTernary(!!ByeChannel), true)
                .addField("\u200B", "\u200B", true)
                .addField("Sticky roles",
                    Utility.toggledTernary(await this.client.guildProvider.get(message.guild!.id, "StickyRoles", false)), false),
        ];

        if (db.WelcomeMessage) {
            pages.push(await GreetHandler.createAndParseWelcomeLeaveMessage(JSON.parse(db.WelcomeMessage), message.member));
        }
        if (db.ByeMessage) {
            pages.push(await GreetHandler.createAndParseWelcomeLeaveMessage(JSON.parse(db.ByeMessage), message.member));
        }

        const categories = db.BlockedCategories.filter(e => blockedCategories[e.CategoryTarget]);

        if (categories.length) {
            (pages[0] as MessageEmbed)
                .addField("Disabled categories", categories.join("\n"), false);
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
