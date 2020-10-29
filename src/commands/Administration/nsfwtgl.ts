import { Command } from "discord-akairo";
import { TextChannel, Message, MessageEmbed } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

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

	async exec(message: Message): Promise<Message> {

		const guidlChnl = message.channel as TextChannel;

		if (guidlChnl.nsfw) {
			guidlChnl.setNSFW(false);
		}

		else {
			guidlChnl.setNSFW(true);
		}

		return message.channel.send(new MessageEmbed({
			color: await getMemberColorAsync(message),
			description: `Toggled ${guidlChnl.name}'s NSFW status to ${guidlChnl.nsfw}.`,
		}));
	}
}