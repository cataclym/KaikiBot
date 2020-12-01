import { Message, MessageEmbed } from "discord.js";
import { config } from "../../config.js";
import { Argument, Command } from "discord-akairo";
import { errorColor, getMemberColorAsync } from "../../util/Util.js";

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

	public async exec(message: Message, args: { command: Command | string } | undefined): Promise<Message | void> {

		const command = args?.command;
		const embed = new MessageEmbed()
			.setColor(await getMemberColorAsync(message));

		if (command instanceof Command) {
			embed.setTitle(`**Name:** ${command.id}`);
			embed.setDescription(`**Aliases:** \`${command.aliases.join("`, `")}\`\n**Description:** ${(command.description.description || command.description)}\n
			${(command?.description.usage ? "**Usage:** " + config.prefix + command.id + " " + command.description.usage : "")}`);
			command.userPermissions ? embed.addField("Requires", command.userPermissions, false) : null;
			command.ownerOnly ? embed.addField("Owner only", "✅", false) : null;

			return message.util?.send(embed);
		}
		else if (typeof command === "string") {
			return message.channel.send(new MessageEmbed({
				description: `**${message.author.tag}** Command \`${command}\` not found.`,
				color: errorColor,
			}));
		}

		const AvUrl = await message.client.users.fetch("140788173885276160", true);
		// Bot author
		embed.setTitle(`${message.client.user?.username} help page`);
		embed.setDescription(`Prefix is currently set to \`${config.prefix}\``);
		embed.addFields([
			{ name: "📋 Command list", value: `\`${config.prefix}cmds\` returns a complete list of commands.`, inline: true },
			{ name: "🔍 Command Info", value: `\`${config.prefix}help [command]\` to get more help. Example: \`${config.prefix}help ping\``, inline: true },
		]);
		embed.setAuthor(`Nadeko Sengoku Bot v${process.env.npm_package_version}`, message.author.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot");
		embed.setFooter("Made by Cata <3", AvUrl.displayAvatarURL({ dynamic: true }));
		await message.util?.send(embed);
	}
}
