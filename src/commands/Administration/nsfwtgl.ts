import { Message, MessageEmbed, TextChannel } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class ChannelNsfwCommand extends KaikiCommand {
	constructor() {
		super("nsfwtgl", {
			aliases: ["nsfwtgl", "nsfw", "nsfwtoggle"],
			clientPermissions: "MANAGE_CHANNELS",
			userPermissions: "MANAGE_CHANNELS",
			description: "Toggles if a channel is NSFW",
			usage: "",
			channel: "guild",
		});
	}

	public async exec(message: Message): Promise<Message> {

		const channel = message.channel as TextChannel;

		const result = `NSFW in \`#${channel.name}\` has been ${!channel.nsfw ? "enabled" : "disabled"}.`;
		await channel.setNSFW(!channel.nsfw, `${message.author.tag} toggled NSFW.`);

		return message.channel.send({
			embeds: [new MessageEmbed({
				description: result,
			})
				.withOkColor(message)],
		});
	}
}
