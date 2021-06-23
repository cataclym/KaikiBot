import { Command } from "@cataclym/discord-akairo";
import { Channel, Collection, GuildChannel, Message, MessageEmbed, Permissions } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";

export default class DeleteChannelCommand extends Command {
	constructor() {
		super("deletechannel", {
			aliases: ["deletechannel", "dtchnl", "delchan"],
			description: { description: "Deletes one or more channels. Also deletes categories and voice channels.",
				usage: "#channel1 #channel2 #channel3" },
			channel: "guild",
			userPermissions: Permissions.FLAGS.MANAGE_CHANNELS,
			clientPermissions: Permissions.FLAGS.MANAGE_CHANNELS,
			args: [{
				id: "channels",
				type: "channels",
				match: "separate",
				otherwise: (m: Message) => noArgGeneric(m),
			}],
		});
	}

	public async exec(m: Message, { channels }: { channels: Collection<string, Channel>[] }): Promise<Message | void> {

		async function deleteChannels() {
			return await Promise.all(channels
				.map((chan) => chan
					.map(async c => c.delete())));
		}

		const deletedChannels = await Promise.all(([] as Promise<Channel>[]).concat(...await deleteChannels()));

		return m.channel.send({
			embeds: [new MessageEmbed()
				.setTitle("Channels deleted")
				.addField("Deleted:", (await Promise.all(deletedChannels
					.map(async (c) => ["unknown", "group", "dm"].includes(c.type)
						? c.id
						: `#${(c as GuildChannel).name} [${c.id}]`,
					))).join("\n"))
				.withOkColor(m)],
		});
	}
}