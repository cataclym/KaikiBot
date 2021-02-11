import { Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { config } from "../../config.js";
import { noArgGeneric } from "../../nsb/Embeds.js";

export default class PrefixConfigCommand extends Command {
	constructor() {
		super("config-prefix", {
			userPermissions: "ADMINISTRATOR",
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
	public async exec(message: Message, { value }: { value?: string}): Promise<Message> {

		const gID = (message.guild as Guild).id,
			oldPrefix = message.client.addons.get(gID, "prefix", config.prefix);
		await message.client.addons.set(gID, "prefix", value);

		return message.channel.send(new MessageEmbed({
			title: "Success!",
			description: `Prefix has been set to \`${value}\` !`,
			footer: { text: `Old prefix: \`${oldPrefix}\`` },
			color: await message.getMemberColorAsync(),
		}));
	}
}
