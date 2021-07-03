import { Argument } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../../lib/Color";
import { noArgGeneric } from "../../lib/Embeds";
import { customClient } from "../../struct/client";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class OkColorConfigCommand extends KaikiCommand {
	constructor() {
		super("config-okcolor", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: Argument.union("color", (m: Message, content: string) => hexColorTable[content]),
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value: string | number }): Promise<Message> {
		const guildID = (message.guild as Guild).id;

		if (typeof value === "number") value = value.toString(16);

		await (this.client as customClient).guildSettings.set(guildID, "okColor", value);

		return message.channel.send({
			embeds: [new MessageEmbed({
				title: "Success!",
				description: `okColor has been set to \`${value}\` !`,
			})
				.withOkColor(message)],
		});
	}
}
