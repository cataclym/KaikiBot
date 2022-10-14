import { BlockedCategories, Guilds } from "@prisma/client";
import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Message, EmbedBuilder, MessageOptions, Permissions } from "discord.js";
import { blockedCategories } from "../../lib/enums/blockedCategories";
import GreetHandler from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

export default class ConfigCommand extends KaikiCommand {
    constructor() {
        super("config", {
            aliases: ["config", "configure", "conf"],
            channel: "guild",
            description: "Configure or display guild specific settings. Will always respond to default prefix regardless of server prefix.",
            usage: ["", "dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>"],
            userPermissions: Permissions.FLAGS.MANAGE_MESSAGES,
            prefix: (msg: Message) => {
                const mentions = [`<@${this.client.user?.id}>`, `<@!${this.client.user?.id}>`];
                const prefixes = [(this.handler.prefix as PrefixSupplier)(msg) as string, process.env.PREFIX || ";"];
                if (this.client.user) {
                    return [...prefixes, ...mentions];
                }
                return prefixes;
            },
        });
    }

    * args(): unknown {
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

    public async exec(message: Message<true>): Promise<Message> {

        if (!message.member) return message;

        let db = await this.client.orm.guilds.findUnique({
            where: { Id: BigInt(message.guildId) },
            include: { BlockedCategories: true },
        });

        if (!db) {
            const g: any = await this.client.db.getOrCreateGuild(BigInt(message.guildId));
            g["BlockedCategories"] = [];
            db = g as (Guilds & { BlockedCategories: BlockedCategories[] });
        }

        // Is this okay?
        const { Anniversary, DadBot, Prefix, ErrorColor, OkColor, WelcomeChannel, ByeChannel } = db as Guilds;

        const categories = db.BlockedCategories
            .map(e => blockedCategories[e.CategoryTarget])
            .filter(Boolean);

        const firstPage: MessageOptions = {
            embeds: [new EmbedBuilder()
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
                    Number(OkColor).toString(16), true)
                .addField("Embed error color",
                    Number(ErrorColor).toString(16), true)
                .addField("\u200B", "\u200B", true)
                .addField("Welcome message",
                    Utility.toggledTernary(!!WelcomeChannel), true)
                .addField("Goodbye message",
                    Utility.toggledTernary(!!ByeChannel), true)
                .addField("\u200B", "\u200B", true)
                .addField("Sticky roles",
                    Utility.toggledTernary(await this.client.guildsDb.get(message.guildId, "StickyRoles", false)), false)],
        };

        if (categories.length && firstPage.embeds) {
            (firstPage.embeds[0] as EmbedBuilder).addField("Disabled categories", categories.join("\n"), false);
        }

        const pages: MessageOptions[] = [];
        pages.push(firstPage);

        if (db.WelcomeMessage) {
            pages.push(await GreetHandler.createAndParseWelcomeLeaveMessage({
                embed: db.WelcomeMessage || null,
                channel: db.WelcomeChannel,
                timeout: db.WelcomeTimeout,
            }, message.member));
        }
        if (db.ByeMessage) {
            pages.push(await GreetHandler.createAndParseWelcomeLeaveMessage({
                embed: db.ByeMessage || null,
                channel: db.ByeChannel,
                timeout: db.ByeTimeout,
            }, message.member));
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
