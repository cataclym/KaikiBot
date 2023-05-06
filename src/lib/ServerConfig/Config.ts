import { BlockedCategories, Guilds } from "@prisma/client";
import { Args, UserError } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { AttachmentBuilder, EmbedBuilder, Guild, Message, MessageCreateOptions, PermissionsBitField } from "discord.js";
import SlashCommandsLib from "../../lib/SlashCommands/SlashCommandsLib";
import { imgFromColor } from "../Color";
import { CategoriesEnum } from "../Enums/categoriesEnum";
import GreetHandler from "../GreetHandler";
import Utility from "../Utility";

export default class Config {
    static async dadbotRun(message: Message<true>, args: Args) {

        Config.checkSubcommandUserPermission(message, PermissionsBitField.Flags.Administrator);

        const booleanArgument = await args.rest("boolean");

        const embed = new EmbedBuilder()
            .withOkColor(message);

        const dadBotEnabled: boolean = message.client.guildsDb.get(message.guildId, "DadBot", false);

        if (booleanArgument) {
            if (!dadBotEnabled) {
                await message.client.guildsDb.set(message.guildId, "DadBot", true);
                await message.guild?.commands.create(SlashCommandsLib.excludeData);

                embed
                    .setTitle(`Dad-bot has been enabled in ${message.guild?.name}!`)
                    .setDescription(`Individual users can still disable dad-bot on themselves with \`${await message.client.fetchPrefix(message)}exclude\`.`);
            }

            else {
                embed
                    .setTitle("Already enabled")
                    .setDescription("You have already **enabled** dad-bot in this server.")
                    .withErrorColor(message);
            }
        }

        else {
            if (dadBotEnabled) {
                await message.client.guildsDb.set(message.guildId, "DadBot", false);

                const cmd = message.guild?.commands.cache.find(c => c.name === "exclude");

                if (cmd) {
                    await message.guild?.commands.delete(cmd.id);
                }

                embed.setTitle(`Dad-bot has been disabled in ${message.guild?.name}!`);
            }

            else {
                embed
                    .setTitle("Already disabled")
                    .setDescription("You have already **disabled** dad-bot in this server.")
                    .withErrorColor(message);
            }

            return message.channel.send({
                embeds: [embed],
            });
        }
    }

    private static checkSubcommandUserPermission(message: Message, permission: bigint) {
        if (!(message.member && message.member.permissions.has(permission))) {
            throw new UserError({
                message: `Missing permission(s): ${new PermissionsBitField(permission).toArray()}`,
                identifier: "configSubcommandPermission",
            });
        }
    }

    static async anniversaryRun(message: Message<true>, args: Args) {
        this.checkSubcommandUserPermission(message, PermissionsBitField.Flags.Administrator);

        const booleanArgument = await args.rest("boolean");

        const embed = new EmbedBuilder()
            .withOkColor(message);

        const anniversaryEnabled: boolean = message.client.guildsDb.get(message.guildId, "Anniversary", false);

        if (booleanArgument) {
            if (!anniversaryEnabled) {
                await message.client.anniversaryService.checkBirthdayOnAdd(message.guild as Guild);
                await message.client.guildsDb.set(message.guildId, "Anniversary", true);
                embed.setDescription(`Anniversary-roles functionality has been enabled in ${message.guild?.name}!`);
            }

            else {
                embed.setDescription("You have already enabled Anniversary-roles.");
            }
        }

        else if (anniversaryEnabled) {
            await message.client.guildsDb.set(message.guildId, "Anniversary", false);
            embed.setDescription(`Anniversary-roles functionality has been disabled in ${message.guild?.name}!`);
        }

        else {
            embed.setDescription("You have already disabled Anniversary-roles.");
        }

        return message.channel.send({
            embeds: [embed],
        });
    }

    static async prefixRun(message: Message<true>, args: Args) {
        const value = args.rest("string");

        this.checkSubcommandUserPermission(message, PermissionsBitField.Flags.Administrator);

        const guildID = message.guild.id,
            oldPrefix = message.client.guildsDb.get(guildID, "Prefix", process.env.PREFIX);

        await message.client.guildsDb.set(guildID, "Prefix", value);

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    title: "Prefix changed!",
                    description: `Prefix has been set to \`${value}\` !`,
                    footer: { text: `Old prefix: \`${oldPrefix}\`` },
                })
                    .withOkColor(message),
            ],
        });
    }

    // Todo finish config
    static async okcolorRun(message: Message<true>, args: Args) {
        return Promise.resolve(undefined);
    }

    static async errorcolorRun(message: Message<true>, args: Args) {
        return Promise.resolve(undefined);
    }

    static async messageRun(message: Message<true>) {

        if (!message.member) throw new Error();

        let db = await message.client.orm.guilds.findUnique({
            where: { Id: BigInt(message.guildId) },
            include: { BlockedCategories: true },
        });

        if (!db) {
            const g = await message.client.db.getOrCreateGuild(BigInt(message.guildId));
            const blockedCategoriesObj: { BlockedCategories: BlockedCategories[] } = { BlockedCategories: [] };
            Object.assign(g, blockedCategoriesObj);
            db = g as (Guilds & { BlockedCategories: BlockedCategories[] });
        }

        // Is this okay?
        const { Anniversary, DadBot, Prefix, ErrorColor, OkColor, WelcomeChannel, ByeChannel } = db;

        const categories = db.BlockedCategories
            .map(e => CategoriesEnum[e.CategoryTarget])
            .filter(Boolean);

        const base = new EmbedBuilder()
            .withOkColor(message)
            .data;

        const realOkColor = Utility.convertHexToRGB(OkColor.toString(16));
        const realErrorColor = Utility.convertHexToRGB(ErrorColor.toString(16));

        const okColorAttachment = new AttachmentBuilder(await imgFromColor(realOkColor), { name: "okColorImg.jpg" });
        const errorColorAttachment = new AttachmentBuilder(await imgFromColor(realErrorColor), { name: "errorColorImg.jpg" });

        const hexOkColor = Utility.convertRGBToHex(realOkColor);
        const hexErrorColor = Utility.convertRGBToHex(realErrorColor);

        const firstPage: MessageCreateOptions = {
            content: undefined,
            components: [],
            files: [okColorAttachment, errorColorAttachment],
            embeds: [
                new EmbedBuilder(base)
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
                            value: Utility.toggledTernary(await message.client.guildsDb.get(message.guildId, "StickyRoles", false)),
                            inline: false,
                        },
                    ])
                    .data,
                new EmbedBuilder(base)
                    .setImage("attachment://okColorImg.jpg")
                    .setFields({
                        name: "Embed ok color",
                        value: hexOkColor,
                        inline: true,
                    })
                    .setColor(hexOkColor),
                new EmbedBuilder(base)
                    .setImage("attachment://errorColorImg.jpg")
                    .setFields({
                        name: "Embed error color",
                        value: hexErrorColor,
                        inline: true,
                    })
                    .setColor(hexErrorColor),
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
            pages.push(await GreetHandler.createAndParseGreetMsg({
                embed: db.WelcomeMessage || null,
                channel: db.WelcomeChannel,
                timeout: db.WelcomeTimeout,
            }, message.member));
        }
        if (db.ByeMessage) {
            pages.push(await GreetHandler.createAndParseGreetMsg({
                embed: db.ByeMessage || null,
                channel: db.ByeChannel,
                timeout: db.ByeTimeout,
            }, message.member));
        }
        return sendPaginatedMessage(message, pages, { owner: message.author });
    }
}
