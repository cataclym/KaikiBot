import { Command } from "discord-akairo";
import { GuildEmoji, Message, MessageEmbed } from "discord.js";
import { errorColor, getMemberColorAsync, trim } from "../../functions/Util";
import { Collection } from "discord.js";
const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
export default class DeleteEmoteCommand extends Command {
	constructor() {
		super("deleteemote", {
			aliases: ["deleteemote", "de"],
			description: { description: "", usage: "" },
			clientPermissions: "MANAGE_EMOJIS",
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			typing: true,
			args: [{
				id: "emotes",
				match: "separate",
				type: "emojis",
			}],
		});
	}
	public async exec(message: Message, { emotes }: { emotes: Collection<string, GuildEmoji>[]}): Promise<Message> {

		async function run() {
			for (const emote of emotes) {

				const newEmote = message.guild?.emojis.cache.get(emote.map(e => e.id)[0]);

				if (newEmote) {

					const deleted = await newEmote.delete();

					await timer(3500);

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
				color: await getMemberColorAsync(message),
				description: `Deleted ${trim(emotes.map((es) => es.map((e) => e.identifier)).join("\n"), 2048)}`,
			}));
		}

		return run();
	}
}