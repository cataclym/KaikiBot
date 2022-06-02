import { Argument, Category, PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

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
                    }, (__, _phrase) => _phrase.length <= 0
                        ? ""
                        : undefined),
                    // Thanks js
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),

                },
            ],
        });
    }

    public async exec(message: Message, { category }: { category: Category<string, KaikiCommand> }): Promise<Message> {

        const { name, repository, version } = this.client.package;

        const prefix = (this.handler.prefix as PrefixSupplier)(message);

        if (category) {

            const emb = new MessageEmbed();
            const filtered = category.filter(cmd => cmd.subCategory !== undefined);

            [...new Set(filtered.map(value => value.subCategory))]
                .forEach(cmd => {
                    if (!cmd) return;
                    emb.addField(cmd, Array.from(filtered.filter(c => c.subCategory === cmd).values())
                        .sort()
                        .map(command => `[\`${command.aliases
                            .sort((a, b) => b.length - a.length
                                || a.localeCompare(b)).join("`, `")}\`]`)
                        .join("\n") || "Empty", true);
                });

            return message.channel.send({
                embeds: [new MessageEmbed(emb)
                    .setTitle(`Commands in ${category.id}`)
                    .setDescription(filtered
                        .filter(cmd => cmd.aliases.length > 0)
                        .map(cmd => `[\`${cmd.aliases
                            .sort((a, b) => b.length - a.length
                                || a.localeCompare(b)).join("`, `")}\`]`)
                        .join("\n") || "Empty")
                    .withOkColor(message)],
            });
        }

        else {
            const embed = new MessageEmbed({
                title: "Command categories",
                description: `\`${prefix}cmds <category>\` returns all commands in the category.`,
                author: {
                    name: `${name} v${version}`,
                    url: repository.url,
                    icon_url: message.author.displayAvatarURL({ dynamic: true }),
                },
                thumbnail: {
                    url: images.utility.commands.notebook,
                },
                footer: {
                    icon_url: (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", { cache: true })))
                        .displayAvatarURL({ dynamic: true }),
                },
            })
                .withOkColor(message);

            for (const _category of this.handler.categories.values()) {
                if (["default", "Etc"].includes(_category.id)) continue;

                embed.addField(`${_category.id} [${_category.filter(c => !!c.aliases.length).size}]`, `${Constants.categories[_category.id]}`, true);
            }

            return message.channel.send({ embeds: [embed] });
        }
    }
}
