import { Argument, PrefixSupplier } from "discord-akairo";
import { execSync } from "child_process";
import { Message, MessageEmbed, PermissionResolvable, Permissions } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class HelpCommand extends KaikiCommand {
    constructor() {
        super("help", {
            aliases: ["help", "h"],
            description: "Shows command info",
            usage: "ping",
            args: [{
                id: "command",
                type: Argument.union("commandAlias", "string"),
            }],
        });
    }

    public async exec(message: Message, args: { command: KaikiCommand | string } | undefined): Promise<Message> {

        const { name, repository, version } = this.client.package;

        const prefix = (this.handler.prefix as PrefixSupplier)(message),
            command = args?.command,
            embed = new MessageEmbed()
                .withOkColor(message);

        if (command instanceof KaikiCommand) {

            const usage = command.usage;

            embed.setTitle(`Command: ${command.id}`)
                .setDescription(`**Aliases:** \`${command.aliases.sort((a, b) => b.length - a.length || a.localeCompare(b)).join("`, `")}\``)
                .addField("**Description:**", command.description || "?", false)
                .addField("**Usage:**", usage
                    ? Array.isArray(usage)
                        ? usage.sort((a, b) => b.length - a.length || a.localeCompare(b)).map(u => `${prefix}${command.id} ${u}`).join("\n")
                        : `${prefix}${command.id} ${usage}`
                    : `${prefix}${command.id}`, false)
                .setFooter({ text: command.categoryID });

            if (command.userPermissions) {
                embed.addField("Requires", new Permissions(command.userPermissions as PermissionResolvable).toArray().join(), false);
            }

            return message.channel.send({ embeds: [embed] });
        }

        else if (typeof command === "string") {
            return message.channel.send({
                embeds: [new MessageEmbed({
                    description: `**${message.author.tag}** Command \`${command}\` not found.`,
                })
                    .withErrorColor(message)],
            });
        }

        const avatarURL = (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", { cache: true })))
            .displayAvatarURL({ dynamic: true });

        embed.setTitle(`${message.client.user?.username} help page`)
            .setDescription(`Current prefix: \`${prefix}\``)
            .addFields([{
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
            }])
            .setAuthor({
                name: `${name} v${version}-${execSync("git rev-parse --short HEAD").toString()}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
                url: repository.url,
            })
            .setFooter({
                text: "Made by Cata <3",
                iconURL: avatarURL,
            });

        return message.channel.send({ embeds: [embed] });
    }
}

