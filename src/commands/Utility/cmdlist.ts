import { Argument, Category, PrefixSupplier } from "discord-akairo";
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
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Constants from "../../struct/Constants";

export default class CommandsList extends KaikiCommand {
    constructor() {
        super("cmdlist", {
            aliases: ["commands", "cmds", "cmdlist"],
            description: "Shows categories, or commands if provided with a category.",
            usage: ["", "admin"],
            args: [
                {
                    id: "category",
                    type: Argument.union((_, phrase) => {
                        return this.handler.categories.find((__, k) => {

                            k = k.toLowerCase();

                            return phrase
                                .toLowerCase()
                                .startsWith(k.slice(0, Math.max(phrase.length - 1, 1)));
                        });
                    }, (_, _phrase) => _phrase.length <= 0
                        ? ""
                        : undefined),
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),

                },
            ],
        });
    }

    public async exec(message: Message, { category }: { category: Category<string, KaikiCommand> }) {

        // Return commands in the provided category
        if (category) {
            return this.categoryReply(message, category);
        }

        else {

            const timestamp = Date.now().toString();

            const component = new ActionRowBuilder<SelectMenuBuilder>()
                .setComponents(new StringSelectMenuBuilder()
                    .setCustomId(timestamp)
                    .setOptions(this.handler.categories
                        .map(cat => new StringSelectMenuOptionBuilder({
                            value: cat.id,
                            label: cat.id,
                            description: cat.id,
                        })),
                    ),
                );

            const embed = await this.categoriesEmbed(message, (this.handler.prefix as PrefixSupplier)(message));

            // Add every category as embed fields
            // Skipping default and Etc categories
            for (const cat of this.handler.categories.values()) {
                if (["default", "Etc"].includes(cat.id)) continue;

                embed.addFields([
                    {
                        name: `${cat.id} [${cat.filter(c => !!c.aliases.length).size}]`,
                        value: `${Constants.categories[cat.id] || "N/A"}`,
                        inline: true,
                    },
                ]);
            }

            await message.channel.send({
                embeds: [embed],
                components: [component],
            });

            return this.handleComponentReply(message, timestamp, embed);
        }
    }

    private categoryReply(message: Message, category: Category<string, KaikiCommand>) {

        const emb = new EmbedBuilder()
            .setTitle(`Commands in ${category.id}`)
            .setDescription(category
                .filter(cmd => !(cmd.subCategory !== undefined))
                .filter(cmd => cmd.aliases.length > 0)
                .map(cmd => `[\`${cmd.aliases
                    .sort((a, b) => b.length - a.length
                        || a.localeCompare(b)).join("`, `")}\`]`)
                .join("\n") || "Empty")
            .withOkColor(message);

        const filtered = category.filter(cmd => cmd.subCategory !== undefined);

        [...new Set(filtered.map(value => value.subCategory))]
            .forEach(cmd => {
                if (!cmd) return;
                emb.addFields([
                    {
                        name: cmd,
                        value: Array.from(filtered.filter(c => c.subCategory === cmd).values())
                            .sort()
                            .map(command => `[\`${command.aliases
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

    private handleComponentReply(message: Message, timestamp: string, emb: EmbedBuilder) {

        const collector = message.createMessageComponentCollector({
            time: 120000,
            componentType: ComponentType.StringSelect,
            filter: (f) => f.customId === timestamp,
        });

        collector.once("collect", interaction => {
            const filtered = this.handler.categories
                .find(c => c.id === interaction.values[0])
                ?.filter((cmd: KaikiCommand) => cmd.subCategory !== undefined);

            if (!filtered) throw new ArgumentError("Provided category couldn't be found!");

            emb.setFields([]);

            [...new Set(filtered.map((value: KaikiCommand) => value.subCategory))]
                .forEach(cmd => {
                    if (!cmd) return;
                    emb.addFields([
                        {
                            name: cmd,
                            value: Array.from(filtered.filter((c: KaikiCommand) => c.subCategory === cmd).values())
                                .sort()
                                .map(command => `[\`${command.aliases
                                    .sort((a, b) => b.length - a.length
                                        || a.localeCompare(b)).join("`, `")}\`]`)
                                .join("\n") || "Empty", inline: true,
                        },
                    ]);
                });

            interaction.update({
                embeds: [emb],
            });
        });

        collector.once("end", interactions => {
            interactions.last()?.update({
                components: [],
            });
        });
    }
}
