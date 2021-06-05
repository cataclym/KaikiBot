import { Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { Exclude } from "../../lib/Embeds";
import { getGuildDocument } from "../../struct/db";

export default class ExcludeCommand extends Command {
	constructor() {
		super("exclude", {
			description: { description: "Adds or removes excluded role from user. Excludes the user from being targeted by dadbot." },
			aliases: ["exclude", "e", "excl"],
			clientPermissions: "MANAGE_ROLES",
			channel: "guild",
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		const db = await getGuildDocument((message.guild as Guild).id);

		let excludedRole = message.guild?.roles.cache.find((r) => r.name === db.settings.excludeRole);

		if (!message.guild?.roles.cache.some(r => r.name === excludedRole?.name)) {
			excludedRole = await message.guild?.roles.create({
				name: db.settings.excludeRole,
				reason: "Role didn't exist yet.",
			});
			await (message.channel.send(new MessageEmbed({
				title: "Error!",
				description: `A role with name \`${db.settings.excludeRole}\` was not found in guild. Creating... `,
				footer: { text: "Beep boop..." },
			})
				.withErrorColor(message)));
		}

		if (!message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.add(excludedRole);
			return message.channel.send(Exclude.addedRoleEmbed(db.settings.excludeRole)
				.withOkColor(message));
		}

		if (message.member?.roles.cache.find((r) => r === excludedRole) && excludedRole) {
			await message.member?.roles.remove(excludedRole);
			return message.channel.send(Exclude.removedRoleEmbed(db.settings.excludeRole));
		}
	}
}
