import { Argument } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed, User } from "discord.js";
import { flags } from "../../lib/Util";
import { KaikiCommand } from "Kaiki";


export default class FetchUserCommand extends KaikiCommand {
	constructor() {
		super("fetch", {
			cooldown: 30000,
			aliases: ["fu", "fetch"],
			description: "Fetches a discord user, shows relevant information. 30sec cooldown.",
			usage: "<id>",
			args: [
				{
					id: "userObject",
					type: Argument.union("user", async (message: Message, phrase: string) => {
						try {
							const u = await message.client.users.fetch(phrase as Snowflake);
							if (u) return u;
						}
						catch {
							return;
						}
					}),
				},
			],
		});
	}
	public async exec(message: Message, { userObject }: { userObject: User }): Promise<Message | void> {

		const userinfo = this.handler.modules.get("uinfo");

		if (message.guild?.members.cache.has(userObject.id) && userinfo) {
			return this.handler.runCommand(message, userinfo, await userinfo.parse(message, userObject.id));
		}

		const userFlags = userObject.flags ? userObject.flags.toArray() : [],
			embed = new MessageEmbed()
				.setDescription(userObject.username)
				.setThumbnail(userObject?.displayAvatarURL({ dynamic: true }))
				.setTitle(userObject.tag)
				.addFields([
					{ name: "ID", value: userObject.id, inline: true },
					{ name: "Account date", value: userObject?.createdAt?.toDateString(), inline: true }])
				.withOkColor(message);

		if (userObject.lastMessage) {
			embed.addField("Last (seen) message", userObject.lastMessage?.createdAt.toLocaleString(), true);
		}
		if (userFlags.length) {
			embed.addField("Flags", userFlags.map((flag) => flags[flag]).join("\n"), true);
		}
		if (userObject.bot) {
			embed.addField("Bot", "✅", true);
		}

		return message.channel.send({ embeds: [embed] });
	}
}
