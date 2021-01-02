import { Collection, GuildEmoji, Message, MessageEmbed } from "discord.js";
import { errorColor, trim } from "../../nsb/Util";
import { Command } from "@cataclym/discord-akairo";
import { noArgGeneric } from "../../nsb/Embeds";
const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
export default class DeleteEmoteCommand extends Command {
	constructor() {
		super("deleteemote", {
			aliases: ["deleteemote", "de"],
			description: { description: "Deletes one or multiple emotes/emoji. Multiple emotes take longer, to avoid ratelimits.", usage: "<:NadekoSip:>" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			typing: true,
			args: [{
				id: "emotes",
				match: "separate",
				type: "emojis",
				otherwise: (msg: Message) => noArgGeneric(msg),
			}],
		});
	}

	public async exec(message: Message, { emotes }: { emotes: Collection<string, GuildEmoji>[]}): Promise<Message> {

		return (async function() {
			let i = 0;
			for (const emote of emotes) {

				const newEmote = message.guild?.emojis.cache.get(emote.map(e => e.id)[0]);

				if (newEmote) {

					i > 0 ? await timer(3500) && i++ : i++;

					const deleted = await newEmote.delete();

					if (!deleted) {
						return message.channel.send(new MessageEmbed({
							title: "Error occured",
							color: errorColor,
							description: "Some or all emotes could not be deleted.",
						}));
					}
				}
				else {
					return message.channel.send(new MessageEmbed({
						title: "Error occured",
						color: errorColor,
						description: "Not valid emote(s).",
					}));
				}
			}

			return message.channel.send(new MessageEmbed({
				title: "Success!",
				color: await message.getMemberColorAsync(),
				description: `Deleted:\n${trim(emotes.map((es) => es.map((e) => e)).join("\n"), 2048)}`,
			}));
		})();
	}
}