import { BlockedCategories, Guilds } from "@prisma/client";
import { Argument, Flag } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message, MessageCreateOptions, PermissionsBitField } from "discord.js";
import { blockedCategories } from "../../lib/Enums/blockedCategories";
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
            userPermissions: PermissionsBitField.Flags.ManageMessages,
            * args() {
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
                return {};
            },
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        if (!message.member) return message;

        let db = await this.client.orm.guilds.findUnique({
            where: { Id: BigInt(message.guildId) },
            include: { BlockedCategories: true },
        });

        if (!db) {
            const g = await this.client.db.getOrCreateGuild(BigInt(message.guildId));
            const blockedCategoriesObj = { BlockedCategories: [] };
            Object.assign(g, blockedCategoriesObj);
            db = g as (Guilds & { BlockedCategories: BlockedCategories[] });
        }

        // Is this okay?
        const { Anniversary, DadBot, Prefix, ErrorColor, OkColor, WelcomeChannel, ByeChannel } = db;

        const categories = db.BlockedCategories
            .map(e => blockedCategories[e.CategoryTarget])
            .filter(Boolean);

        const firstPage: MessageCreateOptions = {
            content: undefined,
            components: [],
            embeds: [
                new EmbedBuilder()
                    .addFields([
                        {
                            name: "Dad-bot",
                            value: Utility.toggledTernary(DadBot),
                            inline: true,
                        },
                        {
                            name: "Anniversary-Roles",
                            value: Utility.toggledTernary(Anniversary),
                            inline: true,
                        },
                        {
                            name: "Guild prefix",
                            value: Prefix === process.env.PREFIX
                                ? `\`${process.env.PREFIX}\` (Default)`
                                : `\`${Prefix}\``,
                            inline: true,
                        },
                        {
                            name: "Embed ok color",
                            value: Number(OkColor).toString(16),
                            inline: true,
                        },
                        {
                            name: "Embed error color",
                            value: Number(ErrorColor).toString(16),
                            inline: true,
                        },
                        {
                            name: "\u200B", value: "\u200B",
                            inline: true,
                        },
                        {
                            name: "Welcome message",
                            value: Utility.toggledTernary(!!WelcomeChannel),
                            inline: true,
                        },
                        {
                            name: "Goodbye message",
                            value: Utility.toggledTernary(!!ByeChannel),
                            inline: true,
                        },
                        {
                            name: "\u200B", value: "\u200B",
                            inline: true,
                        },
                        {
                            name: "Sticky roles",
                            value: Utility.toggledTernary(await this.client.guildsDb.get(message.guildId, "StickyRoles", false)),
                            inline: false,
                        },
                    ])
                    .withOkColor(message)
                    .data,
            ],
        };

        if (categories.length && firstPage.embeds) {
            firstPage.embeds = [
                EmbedBuilder.from(firstPage.embeds[0])
                    .addFields([
                        {
                            name: "Disabled categories",
                            value: categories.join("\n"),
                            inline: false,
                        },
                    ]),
            ];
        }

        const pages: MessageCreateOptions[] = [firstPage];

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
