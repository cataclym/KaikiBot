import { Guild, Message, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class WelcomeToggleCommand extends KaikiCommand {
	constructor() {
		super("welcometoggle", {
			aliases: ["welcometoggle", "welcome"],
			userPermissions: Permissions.FLAGS.MANAGE_GUILD,
			channel: "guild",
			description: "Toggles welcome messages. Bot defaults to current channel if no channel is provided.",
			usage: ["", "#welcome-channel"],
			args: [{
				id: "channel",
				type: "textChannel",
			}],
		});
	}

	public async exec(message: Message, { channel }: { channel: TextChannel | null }): Promise<Message> {

		const guildID = (message.guild as Guild).id;
		const db = await getGuildDocument(guildID);

		db.settings.welcome.enabled = !db.settings.welcome.enabled;
		db.settings.welcome.channel = channel ? channel.id : message.channel.id;
		db.markModified("settings.welcome.enabled");
		db.markModified("settings.welcome.channel");
		await db.save();

		return message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription(`${db.settings.welcome.enabled ? "Enabled" : "Disabled"} welcome message`)
				.withOkColor(message)],
		});
	}
}
