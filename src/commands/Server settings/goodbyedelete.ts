import { Guild, Message, MessageEmbed, Permissions } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class GoodbyeDeleteCommand extends KaikiCommand {
	constructor() {
		super("goodbyedelete", {
			aliases: ["goodbyedelete", "goodbyedel", "byedel"],
			userPermissions: Permissions.FLAGS.MANAGE_GUILD,
			channel: "guild",
			description: "Set the time it takes for goodbye messages to be deleted by the bot",
			usage: ["10"],
			args: [{
				id: "time",
				type: "number",
				otherwise: (m) => noArgGeneric(m),
			}],
		});
	}

	public async exec(message: Message, { time }: { time: number | null }): Promise<Message> {

		const guildID = (message.guild as Guild).id;
		const db = await getGuildDocument(guildID);

		db.settings.goodbye.timeout = time;
		db.markModified("settings.goodbye.timeout");
		await db.save();

		return message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription(`Goodbye messages will be deleted after ${time} seconds.`)
				.withOkColor(message)],
		});
	}
}
