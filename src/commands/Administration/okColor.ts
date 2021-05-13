import { Argument, Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { setSessionCache } from "../../cache/cache.js";
import { hexColorTable } from "../../lib/Color.js";
import { noArgGeneric } from "../../lib/Embeds.js";
import { getGuildDB } from "../../struct/db.js";

export default class OkColorConfigCommand extends Command {
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
	public async exec(message: Message, { value }: { value: string }): Promise<Message> {
		const guildID = (message.guild as Guild).id;

		await getGuildDB(guildID).then(async db => {
			db.settings.okColor = value;
			db.markModified("settings.okColor");
			await db.save();
			setSessionCache("okColorCache", guildID, value);
		});

		return message.channel.send(new MessageEmbed({
			title: "Success!",
			description: `okColor has been set to \`${value}\` !`,
		})
			.withOkColor(message));
	}
}
