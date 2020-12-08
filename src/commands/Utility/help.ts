import { GuildMember, Message, MessageEmbed } from "discord.js";
import { Argument, Command, PrefixSupplier } from "discord-akairo";
import { errorColor } from "../../util/Util.js";

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

		const prefix = (this.handler.prefix as PrefixSupplier)(message);

		const command = args?.command;
		const embed = new MessageEmbed()
			.setColor(await (message.member as GuildMember).getMemberColorAsync());

		if (command instanceof Command) {

			let usage = command.description.usage;

			if (usage) {
				if (usage instanceof Array) {
					usage = usage.map(u => `${prefix}${command.id} ${u}`).join("\n");
				}
				else {
					usage = `${prefix}${command.id} ${usage}`;
				}
			}
			embed.setTitle(`**Name:** ${command.id}`);
			embed.setDescription(`**Aliases:** \`${command.aliases.join("`, `")}\`\n**Description:** ${(command.description.description || command.description)}\n
			${(command?.description.usage ? `**Usage:** ${usage}` : "")}`);
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
		embed.setDescription(`Prefix is currently set to \`${prefix}\``);
		embed.addFields([
			{ name: "📋 Command list", value: `\`${prefix}cmds\` returns a complete list of commands.`, inline: true },
			{ name: "🔍 Command Info", value: `\`${prefix}help [command]\` to get more help. Example: \`${prefix}help ping\``, inline: true },
		]);
		embed.setAuthor(`Nadeko Sengoku Bot v${process.env.npm_package_version}`, message.author.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot");
		embed.setFooter("Made by Cata <3", AvUrl.displayAvatarURL({ dynamic: true }));
		await message.util?.send(embed);
	}
}
