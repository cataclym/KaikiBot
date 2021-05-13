import { Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { config } from "../../config.js";
import { noArgGeneric } from "../../lib/Embeds.js";
import { prefixCache } from "../../struct/client.js";

export default class PrefixConfigCommand extends Command {
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
			oldPrefix = message.client.guildSettings.get(guildID, "prefix", config.prefix);

		message.client.guildSettings.set(guildID, "prefix", value);

		prefixCache[guildID] = value;

		return message.channel.send(new MessageEmbed({
			title: "Success!",
			description: `Prefix has been set to \`${value}\` !`,
			footer: { text: `Old prefix: \`${oldPrefix}\`` },
		})
			.withOkColor(message),
		);
	}
}
