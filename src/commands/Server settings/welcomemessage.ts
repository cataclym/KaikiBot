import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed, Permissions } from "discord.js";
import { EmbedFromJson, EmbedJSON } from "../../interfaces/IGreetLeave";
import { KaikiCommand } from "../../lib/KaikiClass";
import { getGuildDocument } from "../../struct/documentMethods";

export default class WelcomeMessageCommand extends KaikiCommand {
	constructor() {
		super("welcomemessage", {
			aliases: ["welcomemessage", "welcomemsg"],
			userPermissions: Permissions.FLAGS.MANAGE_GUILD,
			channel: "guild",
			args: [{
				id: "msg",
				type: (message, phrase) => {
					try {
						return JSON.parse(message.content.substring(message.content.indexOf(phrase)));
					}
					catch {
						return undefined;
					}
				},
				otherwise: (m) => new MessageEmbed()
					.setTitle("Error")
					.setDescription("Please provide valid json")
					.withErrorColor(m),
			}],
		});
	}

	public async exec(message: Message, { msg }: { msg: EmbedJSON }): Promise<Message> {

		const guildID = (message.guild as Guild).id,
			db = await getGuildDocument(guildID);

		db.settings.welcome.embed = new EmbedFromJson(msg);
		db.markModified("settings.welcome.embed");

		if (!db.settings.welcome.channel) {
			db.settings.welcome.channel = message.channel.id;
			db.markModified("settings.welcome.channel");
		}

		await db.save();

		const prefix = (this.handler.prefix as PrefixSupplier)(message);
		const embeds = [new MessageEmbed()
			.setDescription(`New welcome message has been set!\n\nTest what the message looks like by typing \`${prefix}welcometest\``)
			.withOkColor(message)];

		if (!db.settings.welcome.enabled) {
			embeds.push(new MessageEmbed()
				.setDescription(`Enable \`welcome\` messages by typing \`${prefix}welcome\`.`)
				.withOkColor(message),
			);
		}

		return message.channel.send({
			embeds: embeds,
		});
	}
}
