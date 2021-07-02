import { Argument } from "discord-akairo";
import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import { hexColorTable } from "../../lib/Color";
import { okColor } from "../../lib/Util";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "Kaiki";

export default class WelcomeConfigCommand extends KaikiCommand {
	constructor() {
		super("config-welcome", {
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
					default: "Welcome to %guild%, %member%!",
				},
			],
		});
	}

	public async exec(message: Message, { toggle, channel, embed, color, image, msg }: { toggle: boolean, channel: TextChannel, embed: boolean, image: URL | false, color: string, msg: string }): Promise<Message> {

		const guildID = (message.guild as Guild).id;

		if (toggle) {

			const db = await getGuildDocument(guildID);

			if (db.settings.welcome.enabled) {
				db.settings.welcome.enabled = false;
			}
			else {
				db.settings.welcome.enabled = true;
			}

			db.markModified("settings.welcome.enabled");

			const enabledOrDisabled = db.settings.welcome.enabled;

			await db.save();
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`${enabledOrDisabled ? "Enabled" : "Disabled"} welcome message`)
					.withOkColor(message)],
			});
		}

		if (msg.length > 1500) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle("Message too long")
					.setDescription("Message exceeded 1500 characters, please make sure welcome message is under 1500 characters.")
					.withErrorColor(message)],
			});
		}

		else {
			await getGuildDocument(guildID)
				.then(async db => {
					db.settings.welcome = {
						enabled: true,
						channel: channel.id,
						message: msg,
						image: image ? image.href : image,
						embed: embed,
						color: color ?? db.settings.welcome.color,
					};

					db.markModified("settings.welcome");
					await db.save();
				});
		}

		return message.channel.send({
			embeds: [new MessageEmbed({
				title: "Set welcome message",
				description: `**Image**: ${image.valueOf() ? "Enabled" : "Disabled"}\n
			**Embed**: ${embed ? `Enabled (${color})` : "Disabled"}\n
			**Channel**: ${channel.name} [${channel.id}]`,
			})
				.withOkColor(message)],
		});
	}
}
