import { Argument, Command } from "@cataclym/discord-akairo";
import { TextChannel } from "discord.js";
import { Guild, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../../nsb/Color.js";
import { okColor } from "../../nsb/Util.js";
import { getGuildDB } from "../../struct/db.js";

export default class ErroColorConfigCommand extends Command {
	constructor() {
		super("config-welcome", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "toggle",
					flag: ["toggle", "tgl", "-t", "--toggle", "disable", "--disable"],
					match: "option",
					default: false,
				},
				{
					id: "channel",
					type: "channel",
					default: (m: Message) => m.channel,
				},
				{
					id: "embed",
					flag: ["embed", "e", "-e", "--embed"],
					match: "option",
					default: true,
				},
				{
					id: "color",
					flag: ["color", "c", "-c", "--color"],
					match: "flag",
					default: okColor,
				},
				{
					id: "image",
					flag: ["image", "i", "-i", "--image"],
					match: "flag",
					type: Argument.union("color", (m: Message, content: string) => hexColorTable[content]),
					// Does this work??
					default: false,
				},
				{
					id: "msg",
					type: "string",
					match: "rest",
					default: "Welcome to %guild%, %member%!",
				},
			],
		});
	}
	public async exec(message: Message, { toggle, channel, embed, color, image, msg }: { toggle: boolean, channel: TextChannel, embed: boolean, image: string | false, color: string, msg: string }): Promise<Message> {
		const guildID = (message.guild as Guild).id;

		if (toggle) {
			await getGuildDB(guildID)
				.then(async db => {

					if (db.settings.welcome.enabled) {
						return message.channel.send(new MessageEmbed()
							.setDescription("Welcome message is already disabled.")
							.withErrorColor(message),
						);
					}

					db.settings.welcome.enabled = false;
					db.markModified("settings.welcome.enabled");
					await db.save();
				});

			return message.channel.send(new MessageEmbed()
				.setDescription("Disabled welcome message")
				.withOkColor(message),
			);
		}

		if (msg.length > 1500) {
			return message.channel.send(new MessageEmbed()
				.setTitle("Message too long")
				.setDescription("Message exceeded 1500 characters, please make sure welcome message is under 1500 characters.")
				.withErrorColor(message),
			);
		}

		else {
			await getGuildDB(guildID)
				.then(async db => {
					db.settings.welcome = {
						enabled: true,
						channel: channel.id,
						message: msg,
						image: image,
						embed: embed,
						color: color ?? db.settings.welcome.color,
					};
					db.markModified("settings.welcome");
					await db.save();
				});
		}

		return message.channel.send(new MessageEmbed({
			title: "Set welcome message",
			description: `Welcome message info:\n
			image: ${image ? "Enabled" : "Disabled"}\n
			embed: ${embed ? "Enabled" : "Disabled"}\n
			channel: ${channel.name} [${channel.id}]`,
		})
			.withOkColor(message));
	}
}
