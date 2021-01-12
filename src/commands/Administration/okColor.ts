"use strict";
import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { noArgGeneric, dbError } from "../../nsb/Embeds.js";
import { Argument } from "@cataclym/discord-akairo";
import { hexColorTable } from "../../nsb/Color.js";
const guildConfig = new db.table("guildConfig");

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

		const setColor = guildConfig.set(`${message.guild?.id}.okcolor`, value);
		if (setColor) {
			return message.channel.send(new MessageEmbed({
				title: "Success!",
				description: `OkColor has been set to \`${value}\` !`,
				color: await message.getMemberColorAsync(),
			}));
		}
		else {
			return message.channel.send(dbError);
		}
	}
}