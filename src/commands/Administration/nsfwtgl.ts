import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export default class ChannelNsfwCommand extends Command {
	constructor() {
		super("nsfwtgl", {
			aliases: ["nsfwtgl", "nsfw", "nsfwtoggle"],
			clientPermissions: "MANAGE_CHANNELS",
			userPermissions: "MANAGE_CHANNELS",
			description: { description: "Toggles if a channel is NSFW", usage: "" },
			channel: "guild",
		});
	}

	public async exec(message: Message): Promise<Message> {

		const channel = message.channel as TextChannel;

		channel.setNSFW(!channel.nsfw, `${message.author.tag} toggled NSFW.`);

		return message.channel.send({
			embeds: [new MessageEmbed({
				description: `NSFW in ${channel.name} has been ${!channel.nsfw ? "enabled" : "disabled"}.`,
			})
				.withOkColor(message)],
		});
	}
}