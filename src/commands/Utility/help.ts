import { Argument, Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { execSync } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { name, version } from "../../../package.json";

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

			let usage = command.description.usage;

			if (usage) {
				usage = usage instanceof Array ? usage.map(u => `${prefix}${command.id} ${u}`).join("\n") : `${prefix}${command.id} ${usage}`;
			}

			embed.setTitle(`**Name:** ${command.id}`);
			embed.setDescription(`**Aliases:** \`${command.aliases.join("`, `")}\`\n**Description:** ${command.description.description || command.description}\n`);

			if (command?.description.usage) embed.addField("Usage", usage);
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

		embed.setTitle(`${message.client.user?.username} help page`);
		embed.setDescription(`Prefix is currently set to \`${prefix}\``);
		embed.addFields([
			{ name: "📋 Command list", value: `\`${prefix}cmds\` returns a complete list of commands.`, inline: true },
			{ name: "🔍 Command Info", value: `\`${prefix}help [command]\` to get more help. Example: \`${prefix}help ping\``, inline: true },
		]);
		embed.setAuthor(`${name} v${version}-${execSync("git rev-parse --short HEAD").toString()}`,
			message.author.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot");
		embed.setFooter("Made by Cata <3", AvUrl);
		return message.channel.send(embed);
	}
}

