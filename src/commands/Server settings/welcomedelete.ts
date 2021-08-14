import { Guild, Message, MessageEmbed, Permissions } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";

import { noArgGeneric } from "../../lib/Embeds";

export default class WelcomeDeleteCommand extends KaikiCommand {
	constructor() {
		super("welcomedelete", {
			aliases: ["welcomedelete", "welcomedel"],
			userPermissions: Permissions.FLAGS.MANAGE_GUILD,
			channel: "guild",
			description: "Set the time it takes for welcome messages to be deleted by the bot",
			usage: ["10"],
			args: [{
				id: "time",
				type: "number",
				otherwise: (m) => ({ embeds: [noArgGeneric(m)] }),
			}],
		});
	}

	public async exec(message: Message, { time }: { time: number | null }): Promise<Message> {

		const guildID = (message.guild as Guild).id;
		const db = await getGuildDocument(guildID);

		db.settings.welcome.timeout = time;
		db.markModified("settings.welcome.timeout");
		await db.save();

		return message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription(`Welcome messages will be deleted after ${time} seconds.`)
				.withOkColor(message)],
		});
	}
}
