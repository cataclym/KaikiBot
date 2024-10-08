import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { Subcommand } from "@sapphire/plugin-subcommands";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "help",
    aliases: ["h"],
    description: "Shows command info",
    usage: "ping",
    minorCategory: "Info",
})
export default class HelpCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const { name, repository, version } = this.client.package,
            prefix = await this.client.fetchPrefix(message),
            embed = new EmbedBuilder().withOkColor(message);

        if (args.finished) {
            const avatarURL = this.client.owner.displayAvatarURL();

            embed
                .setTitle(`${message.client.user?.username} help page`)
                .setDescription(`Current prefix: \`${prefix}\``)
                .addFields([
                    {
                        name: "📋 Category list",
                        value: `\`${prefix}cmds\` returns a complete list of command categories.`,
                        inline: false,
                    },
                    {
                        name: "🗒️ Command list",
                        value: `\`${prefix}cmds <category>\` returns a complete list of commands in the given category.`,
                        inline: false,
                    },
                    {
                        name: "🔍 Command Info",
                        value: `\`${prefix}help [command]\` to get more help. Example: \`${prefix}help ping\``,
                        inline: false,
                    },
                    {
                        name: "Policies",
                        value: `[Privacy policy](${Constants.LINKS.PRIVACY_POLICY}) | [Terms of Use](${Constants.LINKS.TERMS_OF_USE})`

                    }
                ])
                .setAuthor({
                    name: `${name} v${version}`,
                    iconURL: message.author.displayAvatarURL(),
                    url: repository.url,
                })
                .setFooter({
                    text: "Made by Cata <3",
                    iconURL: avatarURL,
                });

            return message.reply({ embeds: [embed] });
        }

        const command = await args.pick("command").catch(() => undefined);

        if (command) {
            const aliases = Array.from(command.aliases)
                .sort((a, b) => b.length - a.length || a.localeCompare(b))
                .join("`, `");

            const extractedCommandUsage =
				command instanceof Subcommand
				    ? command.options.usage
				    : command.usage;

            const commandUsage = extractedCommandUsage
                ? Array.isArray(extractedCommandUsage)
                    ? extractedCommandUsage
                        .sort(
                            (a, b) =>
                                b.length - a.length || a.localeCompare(b)
                        )
                        .map((u) => `${prefix}${command.name} ${u}`)
                        .join("\n")
                    : `${prefix}${command.name} ${command.usage}`
                : `${prefix}${command.name}`;

            const cooldown =
				command.options.cooldownDelay ||
				this.client.options.defaultCooldown?.delay ||
				0;

            if (aliases.length) {
                embed.addFields([
                    {
                        name: "**Aliases**",
                        value: `\`${aliases}\``,
                    },
                ]);
            }

            embed
                .setTitle(`${prefix}${command.name}`)
                .setDescription(
                    command.description || "Command is missing description."
                )
                .addFields([
                    {
                        name: "**Usage**",
                        value: commandUsage,
                        inline: false,
                    },
                    {
                        name: "Cooldown",
                        value: `${cooldown / 1000}s`,
                    },
                ])
                .setFooter({ text: command.category || "N/A" });

            if (Array.isArray(command.options.flags)) {
                embed.addFields({
                    name: "Flags",
                    value: command.options.flags
                        .map((flag) => `--${flag}`)
                        .join(", "),
                });
            }

            if (command.options.requiredUserPermissions) {
                embed.addFields([
                    {
                        name: "Requires",
                        value: command.options.requiredUserPermissions.toString(),
                        inline: false,
                    },
                ]);
            }

            return message.reply({ embeds: [embed] });
        } else {
            return message.reply({
                embeds: [
                    new EmbedBuilder({
                        description: `**${message.author.username}** Command \`${args.next()}\` not found.`,
                    }).withErrorColor(message),
                ],
            });
        }
    }
}
