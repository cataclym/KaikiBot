"use strict";
import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { dbError, noArgGeneric } from "../../nsb/Embeds.js";
const guildConfig = new db.table("guildConfig");

export default class PrefixConfigCommand extends Command {
	constructor() {
		super("config-prefix", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: "string",
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value?: string}): Promise<Message> {

		if (value && value !== this.handler.prefix) {
			const setPrefix = guildConfig.set(`${message.guild?.id}.prefix`, value);
			if (setPrefix) {
				return message.channel.send(new MessageEmbed({
					title: "Success!",
					description: `Prefix has been set to \`${value}\` !`,
					color: await message.getMemberColorAsync(),
				}));
			}
			else {
				return message.channel.send(dbError);
			}
		}
		else {
			return message.channel.send(noArgGeneric(message));
		}
	}
}