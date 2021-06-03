import { Argument, Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import { hexColorTable } from "../../lib/Color";
import { okColor } from "../../lib/Util";
import { getGuildDB } from "../../struct/db";

export default class GoodbyeConfigCommand extends Command {
	constructor() {
		super("config-goodbye", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "toggle",
					flag: ["toggle", "tgl", "-t", "--toggle"],
					match: "flag",
				},
				{
					id: "channel",
					type: "textChannel",
					default: (m: Message) => m.channel,
				},
				{
					id: "embed",
					flag: ["embed", "e", "-e", "--embed"],
					match: "flag",
					default: true,
				},
				{
					id: "color",
					flag: ["color", "c", "-c", "--color"],
					match: "option",
					type: Argument.union("color", (m: Message, content: string) => hexColorTable[content]),
					default: okColor,
				},
				{
					id: "image",
					flag: ["image", "i", "-i", "--image"],
					match: "option",
					type: "url",
					// Does this work??
					default: false,
				},
				{
					id: "msg",
					type: "string",
					match: "rest",
					default: "%member% just left 👋",
				},
			],
		});
	}

	public async exec(message: Message, { toggle, channel, embed, color, image, msg }: { toggle: boolean, channel: TextChannel, embed: boolean, image: URL | false, color: string, msg: string }): Promise<Message> {

		const guildID = (message.guild as Guild).id;

		if (toggle) {

			const db = await getGuildDB(guildID);

			if (db.settings.goodbye.enabled) {
				db.settings.goodbye.enabled = false;
			}
			else {
				db.settings.goodbye.enabled = true;
			}

			db.markModified("settings.goodbye.enabled");

			const enabledOrDisabled = db.settings.goodbye.enabled;

			await db.save();
			return message.channel.send(new MessageEmbed()
				.setDescription(`${enabledOrDisabled ? "Enabled" : "Disabled"} goodbye message`)
				.withOkColor(message),
			);
		}

		if (msg.length > 1500) {
			return message.channel.send(new MessageEmbed()
				.setTitle("Message too long")
				.setDescription("Message exceeded 1500 characters, please make sure goodbye message is under 1500 characters.")
				.withErrorColor(message),
			);
		}

		else {
			await getGuildDB(guildID)
				.then(async db => {
					db.settings.goodbye = {
						enabled: true,
						channel: channel.id,
						message: msg,
						image: image ? image.href : image,
						embed: embed,
						color: color ?? db.settings.goodbye.color,
					};

					db.markModified("settings.goodbye");
					await db.save();
				});
		}

		return message.channel.send(new MessageEmbed({
			title: "Set goodbye message",
			description: `**Image**: ${image.valueOf() ? "Enabled" : "Disabled"}\n
			**Embed**: ${embed ? `Enabled (${color})` : "Disabled"}\n
			**Channel**: ${channel.name} [${channel.id}]`,
		})
			.withOkColor(message));
	}
}
