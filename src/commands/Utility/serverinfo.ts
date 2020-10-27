import { Command } from "discord-akairo";
import { Guild } from "discord.js";
import { MessageEmbed, Message } from "discord.js";
import { config } from "../../config";

export default class ServerInfoCommand extends Command {
	constructor() {
		super("serverinfo", {
			aliases: ["serverinfo", "sinfo"],
			description: { description: "Shows information about the current server." },
			args: [
				{
					id: "guild",
					type: "guild",
					default: (message: Message) => message.guild,
				},
			],
		});
	}
	public async exec(message: Message, { guild }: { guild: Guild }): Promise<Message> {
		return message.channel.send(new MessageEmbed({
			thumbnail: { url: <string> guild?.iconURL({ size: 2048, dynamic: true }) },
			title: guild?.name,
			color: guild?.owner?.displayColor,
			author: { name: "Server info" },
			fields: [
				{ name: "ID", value: guild?.id, inline: true },
				{ name: "Owner", value: guild?.owner?.user.tag, inline: true },
				{ name: "Members", value: guild?.memberCount, inline: true },
				{ name:
                    "Channels", value: "Text: " + guild?.channels.cache.filter((channel) => channel.type === "text").size +
                    "\nVoice: " + guild?.channels.cache.filter((channel) => channel.type === "voice").size +
                    "\nCategories: " + guild?.channels.cache.filter((channel) => channel.type === "category").size +
                    "\nNews: " + guild?.channels.cache.filter((channel) => channel.type === "news").size +
                    "\nStore: " + guild?.channels.cache.filter((channel) => channel.type === "store").size, inline: true },
				{ name: "Created At", value: guild?.createdAt.toDateString(), inline: true },
				{ name: "Region", value: guild?.region, inline: true },
				{ name: "Roles", value: guild?.roles.cache.size, inline: true },
				{ name: "Features", value: guild?.features.length ? guild?.features.join("\n") : "NONE", inline: true },
				{ name: "Custom Emojis", value: "Count: **" + guild?.emojis.cache.size +
                    "**\nSee them with `" + config.prefix + "emotecount`", inline: true },
			],
		}));
	}
}