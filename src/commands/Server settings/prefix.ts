import { Guild, Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";

import { prefixCache } from "../../struct/client";

export default class PrefixConfigCommand extends KaikiCommand {
	constructor() {
		super("config-prefix", {
			userPermissions: ["ADMINISTRATOR"],
			channel: "guild",
			args: [
				{
					id: "value",
					type: "string",
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value: string }): Promise<Message | void> {

		const guildID = (message.guild as Guild).id,
			oldPrefix = message.client.guildSettings.get(guildID, "prefix", process.env.PREFIX);

		await message.client.guildSettings.set(guildID, "prefix", value);

		prefixCache[guildID] = value;

		return message.channel.send({
			embeds:	[new MessageEmbed({
				title: "Success!",
				description: `Prefix has been set to \`${value}\` !`,
				footer: { text: `Old prefix: \`${oldPrefix}\`` },
			})
				.withOkColor(message)],
		});
	}
}
