import { Argument, Category, PrefixSupplier } from "discord-akairo";
import { EmbedBuilder, Message } from "discord.js";

import images from "../../data/images.json";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Constants from "../../struct/Constants";

export default class commandsList extends KaikiCommand {
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

    public async exec(message: Message, { category }: { category: Category<string, KaikiCommand> }): Promise<Message> {

        const { name, repository, version } = this.client.package;

        const prefix = (this.handler.prefix as PrefixSupplier)(message);

        if (category) {

            const emb = new EmbedBuilder();
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
                embeds: [
                    new EmbedBuilder(emb.data)
                        .setTitle(`Commands in ${category.id}`)
                        .setDescription(category
                            .filter(cmd => !(cmd.subCategory !== undefined))
                            .filter(cmd => cmd.aliases.length > 0)
                            .map(cmd => `[\`${cmd.aliases
                                .sort((a, b) => b.length - a.length
                                    || a.localeCompare(b)).join("`, `")}\`]`)
                            .join("\n") || "Empty")
                        .withOkColor(message),
                ],
            });
        }

        else {
            const embed = new EmbedBuilder({
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
                    iconURL: (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", { cache: true })))
                        .displayAvatarURL(),
                },
            })
                .withOkColor(message);

            for (const _category of this.handler.categories.values()) {
                if (["default", "Etc"].includes(_category.id)) continue;

                embed.addFields([
                    {
                        name: `${_category.id} [${_category.filter(c => !!c.aliases.length).size}]`,
                        value: `${Constants.categories[_category.id]}`,
                        inline: true,
                    },
                ]);
            }

            return message.channel.send({ embeds: [embed] });
        }
    }
}
