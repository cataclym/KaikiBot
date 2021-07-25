import { Guild, Message, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class GoodbyeConfigCommand extends KaikiCommand {
	constructor() {
		super("goodbye", {
			aliases: ["goodbyetoggle", "goodbye", "byetoggle", "bye"],
			userPermissions: Permissions.FLAGS.MANAGE_GUILD,
			channel: "guild",
			description: "Toggles leave messages. Bot defaults to current channel if no channel is provided.",
			usage: ["", "#leave-channel"],
			args: [{
				id: "channel",
				type: "textChannel",
			}],
		});
	}

	public async exec(message: Message, { channel }: { channel: TextChannel | null }): Promise<Message> {

		const guildID = (message.guild as Guild).id;
		const db = await getGuildDocument(guildID);

		db.settings.goodbye.enabled = !db.settings.goodbye.enabled;
		db.settings.goodbye.channel = channel ? channel.id : message.channel.id;
		db.markModified("settings.goodbye.enabled");
		db.markModified("settings.goodbye.channel");
		await db.save();

		return message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription(`${db.settings.goodbye.enabled ? "Enabled" : "Disabled"} goodbye message`)
				.withOkColor(message)],
		});
	}
}
