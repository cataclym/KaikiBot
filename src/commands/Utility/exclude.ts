import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { config } from "../../config.js";

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

		let excludedRole = message.guild?.roles.cache.find((r) => r.name === config.names);

		if (!message.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
			excludedRole = await message.guild?.roles.create({
				data: { name: config.names },
				reason: "Role didn't exist yet.",
			});
			await (message.channel.send(new MessageEmbed({
				title: "Error!",
				description: `A role with name \`${config.names}\` was not found in guild. Creating... `,
				footer: { text: "Beep boop..." },
			})
				.withErrorColor(message)));
		}

		if (!message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.add(excludedRole);
			return message.channel.send(addedRoleEmbed
				.withOkColor(message));
		}

		if (message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.remove(excludedRole);
			return message.channel.send(removedRoleEmbed
				.withOkColor(message));
		}
	}
}
