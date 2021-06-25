import { Argument, Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { execSync } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { name, repository, version } from "../../../package.json";

export default class HelpCommand extends Command {
	constructor() {
		super("help", {
			aliases: ["help", "h"],
			description: { description: "Shows command info", usage: "ping" },
			args: [{
				id: "command",
				type: Argument.union("commandAlias", "string"),
			}],
		});
	}

	public async exec(message: Message, args: { command: Command | string } | undefined): Promise<Message> {

		const prefix = (this.handler.prefix as PrefixSupplier)(message);

		const command = args?.command;
		const embed = new MessageEmbed()
			.withOkColor(message);

		if (command instanceof Command) {

			let usage;

			if (typeof command.description !== "string") {
				usage = command.description.usage instanceof Array
					? command.description.usage.map(u => `${prefix}${command.id} ${u}`).join("\n")
					: `${prefix}${command.id} ${usage}`;
			}

			embed.setTitle(`**Name:** ${command.id}`)
				.setDescription(`**Aliases:** \`${command.aliases.join("`, `")}\``)
				.setFooter(command.categoryID);

			embed.addField("**Description:**", typeof command.description === "string" ? "?" : command.description.description, false);
			embed.addField("**Usage:**", usage && usage.length
				? usage
				: `${prefix}${command.id}`, false);

			if (command.userPermissions) embed.addField("Requires", command.userPermissions, false);
			if (command.ownerOnly) embed.addField("Owner only", "✅", false);

			return message.channel.send(embed);
		}

		else if (typeof command === "string") {
			return message.channel.send(new MessageEmbed({
				description: `**${message.author.tag}** Command \`${command}\` not found.`,
			})
				.withErrorColor(message));
		}

		const AvUrl = (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", true)))
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

		return message.channel.send(embed);
	}
}

