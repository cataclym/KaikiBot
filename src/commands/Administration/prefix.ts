"use strict";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import db from "quick.db";
import { errorColor, getMemberColorAsync } from "../../util/Util.js";
import { noArgGeneric } from "../../util/embeds.js";
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
					color: await getMemberColorAsync(message),
				}));
			}
			else {
				return message.channel.send(new MessageEmbed({
					title: "Error",
					description: "Failed to set prefix.",
					color: errorColor,
				}));
			}
		}
		else {
			return message.channel.send(noArgGeneric(message));
		}
	}
}