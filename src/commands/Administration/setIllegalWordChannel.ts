import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { illegalWordCache } from "../../cache/cache";
import { getGuildDB } from "../../struct/db";

export default class SetIllegalWordChannel extends Command {
	constructor() {
		super("setillegalwordchannel", {
			aliases: ["setillegalwordchannel", "iwc", "siwc"],
			userPermissions: "MANAGE_MESSAGES",
			clientPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
			channel: "guild",
			description: { description: "Set a channel where a certain word is illegal to say",
				usage: ["#no-hi hi"] },
			args: [
				{
					id: "channel",
					type: "textChannel",
				},
				{
					id: "word",
					type: "string",
				},
			],
		});
	}

	public async exec(message: Message, { channel, word }: { channel: TextChannel, word: string }): Promise<Message> {

		const gid = message.guild!.id,
			db = await getGuildDB(gid),
			object = {
				channel: channel?.id,
				word: word,
			};

		if (!channel || !word) {
			return message.channel.send(new MessageEmbed()
				.addFields([
					{ name: "Channel", value: db.illegalWordChannel?.channel, inline: false },
					{ name: "Word", value: db.illegalWordChannel?.word, inline: false },
				])
				.withOkColor(message),
			);
		}

		db.illegalWordChannel = object;
		illegalWordCache[gid] = object;

		db.markModified("illegalWordChannel");
		db.save();

		return message.channel.send(new MessageEmbed()
			.setTitle("Illegal word set!")
			.setDescription(`Saying \`${word}\` in ${channel.name} will force me to delete the message`)
			.withOkColor(message),
		);
	}
}