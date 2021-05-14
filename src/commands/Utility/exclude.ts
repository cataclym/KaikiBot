import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { config } from "../../config.js";
import { Exclude } from "../../lib/Embeds.js";

export default class ExcludeCommand extends Command {
	constructor() {
		super("exclude", {
			description: { description: "Adds or removes excluded role from user. Excludes the user from being targeted by dadbot." },
			aliases: ["exclude", "e", "excl"],
			clientPermissions: "MANAGE_ROLES",
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		let excludedRole = message.guild?.roles.cache.find((r) => r.name === config.dadbotRole);

		if (!message.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
			excludedRole = await message.guild?.roles.create({
				name: config.dadbotRole,
				reason: "Role didn't exist yet.",
			});
			await (message.channel.send(new MessageEmbed({
				title: "Error!",
				description: `A role with name \`${config.dadbotRole}\` was not found in guild. Creating... `,
				footer: { text: "Beep boop..." },
			})
				.withErrorColor(message)));
		}

		if (!message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.add(excludedRole);
			return message.channel.send(Exclude.addedRoleEmbed
				.withOkColor(message));
		}

		if (message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.remove(excludedRole);
			return message.channel.send(Exclude.removedRoleEmbed
				.withOkColor(message));
		}
	}
}
