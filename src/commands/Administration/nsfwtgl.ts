import { Command } from "discord-akairo";
import { TextChannel, Message, MessageEmbed, GuildMember } from "discord.js";

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

		const guidlChnl = message.channel as TextChannel;

		if (guidlChnl.nsfw) {
			guidlChnl.setNSFW(false);
		}

		else {
			guidlChnl.setNSFW(true);
		}

		return message.channel.send(new MessageEmbed({
			color: await (message.member as GuildMember).getMemberColorAsync(),
			description: `Toggled ${guidlChnl.name}'s NSFW status to ${!guidlChnl.nsfw}.`,
		}));
	}
}