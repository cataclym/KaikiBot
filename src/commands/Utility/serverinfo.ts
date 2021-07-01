import { Command, PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";

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

		const emb = new MessageEmbed({
			thumbnail: { url: <string> guild?.iconURL({ format: "png", size: 2048, dynamic: true }) },
			title: guild?.name,
			author: { name: "Server info" },
			fields: [
				{ name: "ID", value: guild?.id, inline: true },
				{ name: "Owner", value: message.client.users.cache.get(guild.ownerID)?.tag ?? guild.ownerID, inline: true },
				{ name: "Members", value: String(guild?.memberCount), inline: true },
				{ name:
                    "Channels", value: "Text: **" + guild?.channels.cache.filter((channel) => channel.type === "text").size +
                    "**\nVoice: **" + guild?.channels.cache.filter((channel) => channel.type === "voice").size +
                    "**\nCategories: **" + guild?.channels.cache.filter((channel) => channel.type === "category").size +
                    "**\nNews: **" + guild?.channels.cache.filter((channel) => channel.type === "news").size +
                    "**\nStore: **" + guild?.channels.cache.filter((channel) => channel.type === "store").size + "**", inline: true },
				{ name: "Created At", value: guild?.createdAt.toDateString(), inline: true },
				{ name: "Roles", value: String(guild?.roles.cache.size), inline: true },
				{ name: "Features", value: guild?.features.length ? guild?.features.join("\n") : "NONE", inline: true },
				{ name: "Custom Emojis", value: "Count: **" + guild?.emojis.cache.size +
                    "**\nSee them with `" + (this.handler.prefix as PrefixSupplier)(message) + "emotecount`", inline: true },
			],
		});

		guild.systemChannel ? emb.addField("System channel", guild.systemChannel.toString(), true) : null;
		guild.rulesChannel ? emb.addField("Rules channel", guild.rulesChannel.toString(), true) : null;
		guild.publicUpdatesChannel ? emb.addField("Public Updates channel", guild.publicUpdatesChannel.toString(), true) : null;
		guild.widgetChannel ? emb.addField("Widget channel", guild.widgetChannel.toString(), true) : null;

		return message.channel.send({ embeds: [emb.withOkColor(message)] });
	}
}
