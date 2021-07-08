import { Guild, GuildChannel, Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import { getGuildDocument } from "../../struct/documentMethods";

export default class ExcludeDadbotChannelCommand extends KaikiCommand {
	constructor() {
		super("excludechannel", {
			aliases: ["excludechannel", "excludechnl", "echnl"],
			userPermissions: "MANAGE_CHANNELS",
			channel: "guild",
			description: "TODO",
			usage: ["#channel"],
			args: [
				{
					id: "channel",
					type: "textChannel",
				},
			],
		});
	}

	public async exec(message: Message, { channel }: { channel: TextChannel}): Promise<Message> {

		const gId = (message.guild as Guild).id;
		const guildDb = await getGuildDocument(gId);

		if (!channel) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle("Excluded channels")
					.setDescription(Object.keys(guildDb.settings.dadBot.excludedChannels ?? {})
				 		.map(k => message.guild!.channels.cache.get(k as Snowflake) ?? k)
						.sort((a, b) => {
							return (a as GuildChannel).name < (b as GuildChannel).name
								? -1
								: 1;
						})
						.join("\n"))
					.withOkColor(message)],
			});
		}

		const dadBot = guildDb.settings.dadBot;
		if (dadBot.excludedChannels && dadBot.excludedChannels[channel.id]) {
			delete guildDb.settings.dadBot.excludedChannels[channel.id];
			guildDb.markModified("settings.dadBot.excludedChannels");
			await message.client.guildSettings.set(gId, "dadBot", guildDb.settings.dadBot);
			await guildDb.save();

			return message.channel.send({ embeds:
					[new MessageEmbed()
						.setDescription(`Removed ${channel} from exclusion list`)
						.withOkColor(message)],
			});
		}

		if (typeof guildDb.settings["dadBot"] === "boolean") {
			const bool = guildDb.settings["dadBot"];
			guildDb.settings["dadBot"] = {
				enabled: bool,
				excludedChannels: {},
			};
			guildDb.markModified("settings.dadBot");
		}

		guildDb.settings.dadBot.excludedChannels[channel.id] = true;
		guildDb.markModified("settings.dadBot.excludedChannels");
		await message.client.guildSettings.set(gId, "dadBot", guildDb.settings.dadBot);
		await guildDb.save();

		return message.channel.send({ embeds:
				[new MessageEmbed()
					.setDescription(`Added ${channel} to exclusion list`)
					.withOkColor(message)],
		});
	}
}
