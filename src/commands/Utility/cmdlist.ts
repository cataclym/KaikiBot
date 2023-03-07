import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import {
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    Message,
    SelectMenuBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import images from "../../data/images.json";
import ArgumentError from "../../lib/Errors/ArgumentError";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "commands",
    aliases: ["cmds", "cmdlist"],
    description: "Shows categories, or commands if provided with a category.",
    usage: ["", "admin"],
})
export default class CommandsList extends KaikiCommand {

    static ignoredCategories = ["default", "Etc"];

    public async exec(message: Message, args: Args) {

        const filteredCategories = this.store.categories
            .filter(cat => !CommandsList.ignoredCategories.includes(cat));

        const category = await args.pick(KaikiArgumentsTypes.categoryIArgument);

        if (args.finished) {

            const timestamp = Date.now().toString();

            const component = new ActionRowBuilder<SelectMenuBuilder>()
                .setComponents(new StringSelectMenuBuilder()
                    .setCustomId(timestamp)
                    .setOptions(filteredCategories
                        .map(cat => new StringSelectMenuOptionBuilder({
                            value: cat,
                            label: cat,
                            description: cat,
                        })),
                    ),
                );

            const embed = await this.categoriesEmbed(message, await this.client.fetchPrefix(message));

            // Add every category as embed fields
            for (const cat of filteredCategories) {
                embed.addFields([
                    {
                        name: `${cat} [${this.store.filter(cmd => cmd.category === cat).size}]`,
                        value: `${Constants.categories[cat] || "N/A"}`,
                        inline: true,
                    },
                ]);
            }

            const interactionMessage = await message.channel.send({
                embeds: [embed],
                components: [component],
            });

            return this.handleComponentReply(interactionMessage, message.author.id, timestamp, embed);
        }

        // Return commands in the provided category
        if (category) {
            return this.categoryReply(message, category);
        }
    }

    private categoryReply(message: Message, category: string) {

        const cmds = this.store.filter(c => c.category === category);

        const emb = new EmbedBuilder()
            .setTitle(`Commands in ${category}`)
            .setDescription(cmds
                .filter(cmd => cmd.subCategory === undefined)
                .map(cmd => `[\`${Array.from(cmd.aliases)
                    .sort((a, b) => b.length - a.length
                        || a.localeCompare(b)).join("`, `")}\`]`)
                .join("\n") || "Empty")
            .withOkColor(message);

        const filtered = cmds.filter(cmd => cmd.subCategory !== undefined);

        [...new Set(filtered.map(value => value.subCategory))]
            .forEach(cmd => {
                if (!cmd) return;
                emb.addFields([
                    {
                        name: cmd,
                        value: Array.from(filtered.filter(c => c.subCategory === cmd).values())
                            .sort()
                            .map(command => `[\`${Array.from(command.aliases)
                                .sort((a, b) => b.length - a.length
                                    || a.localeCompare(b)).join("`, `")}\`]`)
                            .join("\n") || "Empty", inline: true,
                    },
                ]);
            });

        return message.channel.send({
            embeds: [emb],
        });
    }

    private categoriesEmbed = async (message: Message, prefix: any, {
        name,
        version,
        repository,
    } = this.client.package) => new EmbedBuilder({
        title: "Command categories",
        description: `\`${prefix}cmds <category>\` returns all commands in the category.`,
        author: {
            name: `${name} v${version}`,
            url: repository.url,
            iconURL: message.author.displayAvatarURL(),
        },
        thumbnail: {
            url: images.utility.commands.notebook,
        },
        footer: {
            text: message.author.tag,
            iconURL: (message.client.users.cache.get("140788173885276160")
                || (await message.client.users.fetch("140788173885276160", { cache: true })))
                .displayAvatarURL(),
        },
    });

    private async handleComponentReply(message: Message, userId: string, timestamp: string, emb: EmbedBuilder) {

        const promise = await message.awaitMessageComponent({
            time: 60000,
            componentType: ComponentType.StringSelect,
            filter: i => {
                i.deferUpdate();
                return i.customId === timestamp
                    && i.user.id === userId;
            },
        })
            .catch(async () => {
                await message.edit({
                    components: [],
                });
            });

        if (promise) {
            const category = this.store.categories
                .find(c => c === promise.values[0]);

            if (!category) throw new ArgumentError("Provided category couldn't be found!");

            const cmds = this.store.filter(c => c.category === category);

            const filtered = cmds
                .filter(cmd => cmd.subCategory !== undefined);

            emb.setTitle(category)
                .setDescription(cmds
                    .filter(cmd => cmd.subCategory === undefined)
                    .map(cmd => `[\`${Array.from(cmd.aliases)
                        .sort((a, b) => b.length - a.length
                            || a.localeCompare(b)).join("`, `")}\`]`)
                    .join("\n") || "Empty");

            emb.setFields([]);

            [...new Set(filtered.map((value: KaikiCommand) => value.subCategory))]
                .forEach(cmd => {
                    if (!cmd) return;
                    emb.addFields([
                        {
                            name: cmd,
                            value: Array.from(filtered.filter((c: KaikiCommand) => c.subCategory === cmd).values())
                                .sort()
                                .map(command => `[\`${Array.from(command.aliases)
                                    .sort((a, b) => b.length - a.length
                                        || a.localeCompare(b)).join("`, `")}\`]`)
                                .join("\n") || "Empty", inline: true,
                        },
                    ]);
                });

            await message.edit({
                embeds: [emb],
                components: [],
            });
        }
    }
}
