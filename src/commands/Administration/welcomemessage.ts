import { Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "../../lib/KaikiClass";
import { EmbedJSON, EmbedJSONClass } from "../../interfaces/IGreetLeave";
import { PrefixSupplier } from "discord-akairo";

export default class WelcomeMessageCommand extends KaikiCommand {
	constructor() {
		super("welcomemessage", {
			aliases: ["welcomemessage", "welcomemsg"],
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [{
				id: "msg",
				type: (message, phrase) => JSON.parse(phrase)
					.catch(() => null),
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

		db.settings.welcome.embed = new EmbedJSONClass(msg);
		db.markModified("settings.welcome.embed");
		await db.save();

		const prefix = (this.handler.prefix as PrefixSupplier)(message);
		const embed = [new MessageEmbed()
			.setDescription(`New greet message has been set!\n\nTest what the message looks like by typing \`${prefix}welcometest\``)
			.withOkColor(message)];

		if (!db.settings.welcome.enabled) {
			embed.push(new MessageEmbed()
				.setDescription(`Enable welcome messages by typing \`${prefix}welcome\`.`)
				.withOkColor(message),
			);
		}

		return message.channel.send({
			embeds: embed,
		});
	}
}
