import { Argument, PrefixSupplier } from "discord-akairo";
import { execSync } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { name, repository, version } from "../../../package.json";
import { KaikiCommand } from "../../lib/KaikiClass";

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

		const prefix = (this.handler.prefix as PrefixSupplier)(message),
			command = args?.command,
			embed = new MessageEmbed()
				.withOkColor(message);

		if (command instanceof KaikiCommand) {

			const cmdUsage = command.usage;

			embed.setTitle(`Command: ${command.id}`)
				.setDescription(`**Aliases:** \`${command.aliases.sort((a, b) => b.length - a.length
					|| a.localeCompare(b)).join("`, `")}\``)
				.addField("**Description:**", command.description || "?", false)
				.addField("**Usage:**", cmdUsage
					? Array.isArray(cmdUsage)
						? cmdUsage.sort((a, b) => b.length - a.length
							|| a.localeCompare(b)).map(u => `${prefix}${command.id} ${u}`).join("\n")
						: `${prefix}${command.id} ${cmdUsage}`
					: `${prefix}${command.id}`, false)
				.setFooter(command.categoryID);

			if (command.userPermissions) embed.addField("Requires", command.userPermissions.toString(), false);

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

		const AvUrl = (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", { cache: true })))
			.displayAvatarURL({ dynamic: true });

		embed.setTitle(`${message.client.user?.username} help page`)
			.setDescription(`Prefix is currently set to \`${prefix}\``)
			.addFields([
				{ name: "📋 Command list", value: `\`${prefix}cmds\` returns a complete list of command categories.`, inline: true },
				{ name: "🔍 Command Info", value: `\`${prefix}help [command]\` to get more help. Example: \`${prefix}help ping\``, inline: true },
			])
			.setAuthor(`${name} v${version}-${execSync("git rev-parse --short HEAD").toString()}`,
				message.author.displayAvatarURL({ dynamic: true }), repository.url)
			.setFooter("Made by Cata <3", AvUrl);

		return message.channel.send({ embeds: [embed] });
	}
}

