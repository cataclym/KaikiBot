import { execSync } from "child_process";
import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message, PermissionResolvable, PermissionsBitField } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "help",
    aliases: ["h"],
    description: "Shows command info",
    usage: "ping",
    subCategory: "Info",
})
export default class HelpCommand extends KaikiCommand {
    public async messageRun(message: Message, args) {

        const { name, repository, version } = this.client.package;

        const prefix = this.client.fetchPrefix(message),
            command = args?.command,
            embed = new EmbedBuilder()
                .withOkColor(message);

        if (command instanceof KaikiCommand) {

            const aliases = command.aliases.sort((a, b) => b.length - a.length || a.localeCompare(b)).join("`, `");
            const commandUsage = command.usage
                ? Array.isArray(command.usage)
                    ? command.usage.sort((a, b) => b.length - a.length || a.localeCompare(b)).map(u => `${prefix}${command.id} ${u}`).join("\n")
                    : `${prefix}${command.id} ${command.usage}`
                : `${prefix}${command.id}`;

            embed.setTitle(`${prefix}${command.id}`)
                .setDescription(command.description || "Command is missing description.")
                .addFields([
                    {
                        name: "**Aliases**",
                        value: `\`${aliases}\``,
                    },
                    {
                        name: "**Usage**",
                        value: commandUsage,
                        inline: false,
                    },
                    {
                        name: "Cooldown",
                        value: `${(command.cooldown || this.handler.defaultCooldown) / 1000}s`,
                    },
                ])
                .setFooter({ text: command.categoryID });

            if (command.userPermissions) {
                embed.addFields([
                    {
                        name: "Requires",
                        value: new PermissionsBitField(command.userPermissions as PermissionResolvable).toArray().join(),
                        inline: false,
                    },
                ]);
            }

            return message.channel.send({ embeds: [embed] });
        }

        else if (typeof command === "string") {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder({
                        description: `**${message.author.tag}** Command \`${command}\` not found.`,
                    })
                        .withErrorColor(message),
                ],
            });
        }

        const avatarURL = this.client.owner.displayAvatarURL();

        embed.setTitle(`${message.client.user?.username} help page`)
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
            ])
            .setAuthor({
                name: `${name} v${version}-${execSync("git rev-parse --short HEAD").toString()}`,
                iconURL: message.author.displayAvatarURL(),
                url: repository.url,
            })
            .setFooter({
                text: "Made by Cata <3",
                iconURL: avatarURL,
            });

        return message.channel.send({ embeds: [embed] });
    }
}

