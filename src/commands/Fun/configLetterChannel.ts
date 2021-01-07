import { Command } from "@cataclym/discord-akairo";
import { Message, TextChannel } from "discord.js";
import db from "quick.db";
import { noArgGeneric } from "../../nsb/Embeds";
const guildConfig = new db.table("guildConfig");

export default class ChannelLetterConfigCommand extends Command {
	constructor() {
		super("config-channel", {
			clientPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
			userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
			description: { description: "Provide no letter to disable.", usage: ["<channel> <single letter>", ""] },
			channel: "guild",
			args: [
				{
					id: "channel",
					type: "textChannel",
					otherwise: (m: Message) => noArgGeneric(m),
				},
				{
					id: "letter",
					type: "string",
					default: null,
				},
			],
		});
	}
	public async exec(message: Message, { channel, letter }: { channel: TextChannel, letter: string }): Promise<Message> {

		const currentChannel: string[] | undefined = guildConfig.get(`letter-channels.${message.guild?.id}`);

		if (currentChannel && currentChannel[0]) {
			return message.channel.send("");
		}
		else if (letter) {
			guildConfig.push(`letter-channels.${message.guild?.id}`, [channel, letter]);
			return message.channel.send("");
		}
	}
}