import { FailureData } from "discord-akairo";
import { ActivityType } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { getBotDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";

const validTypes = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"];

export default class SetActivityCommand extends KaikiCommand {
	constructor() {
		super("setactivity", {
			aliases: ["setactivity", "setac"],
			description: "Set the bot's activity.",
			usage: ["<type> <Activity>", "playing with Dreb"],
			ownerOnly: true,
			args: [
				{
					id: "type",
					type: validTypes,
					otherwise: (msg: Message, _: FailureData) => new MessageEmbed()
						.setDescription(`\`${_.phrase}\` is not an status type`)
						.addField("Valid types", validTypes.join("\n"))
						.withErrorColor(msg),
				},
				{
					id: "name",
					type: "string",
					match: "restContent",
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}
	public async exec(message: Message, { type, name }: { type: ActivityType, name: string}): Promise<Message> {

		message.client.user?.setActivity({ type, name });

		const botDocument = await getBotDocument();
		botDocument.settings.activity = name;
		botDocument.settings.activityType = type;
		botDocument.markModified("settings");
		botDocument.save();

		return message.channel.send({
			embeds: [new MessageEmbed()
				.addField("Status changed", `**Type**: ${type}\n**Activity**: ${name}`)
				.withOkColor(message)],
		});
	}
}
