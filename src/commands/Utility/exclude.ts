import { Command } from "discord-akairo";
import { config } from "../../config.js";
import { GuildMember, MessageEmbed, Message } from "discord.js";
import { errorColor } from "../../util/Util";

const errorEmbed = new MessageEmbed({
	title: "Error!",
	color: errorColor,
	description: `A role with name \`${config.names}\` was not found in guild. Creating... `,
	footer: { text: "Beep boop..." },
});
const addedRoleEmbed = new MessageEmbed({
	title: "Success!",
	description: `Added role \`${config.names}\`.\nType the command again to remove.`,
});
const removedRoleEmbed = new MessageEmbed({
	title: "Success!",
	description: `Removed role \`${config.names}\`.\nType the command again to add it back.`,
});

export default class ExcludeCommand extends Command {
	constructor() {
		super("exclude", {
			description: { description: "Adds or removes excluded role from user. Excludes the user from being targeted by dadbot." },
			aliases: ["exclude", "e", "excl"],
			clientPermissions: "MANAGE_ROLES",
		});
	}

	public async exec(message: Message): Promise<Message | void> {
		const color = await (message.member as GuildMember).getMemberColorAsync();
		addedRoleEmbed.setColor(color);
		removedRoleEmbed.setColor(color);
		let excludedRole = message.guild?.roles.cache.find((r) => r.name === config.names);

		if (!message.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
			excludedRole = await message.guild?.roles.create({
				data: { name: config.names },
				reason: "Role didn't exist yet.",
			});
			await (message.channel.send(errorEmbed));
		}
		if (!message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.add(excludedRole);
			return message.channel.send(addedRoleEmbed);
		}
		if (message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.remove(excludedRole);
			return message.channel.send(removedRoleEmbed);
		}
	}
}
