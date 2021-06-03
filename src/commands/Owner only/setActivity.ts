import { Command, FailureData } from "@cataclym/discord-akairo";
import { ActivityType } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { getBotDB } from "../../struct/db";
const validTypes = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"];

export default class SetActivityCommand extends Command {
	constructor() {
		super("setactivity", {
			aliases: ["setactivity", "setac"],
			description: { description: "Set the bot's activity, persistent through reboot.", usage: ["<type> <Activity>", "playing with Dreb"] },
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

		const db = await getBotDB();
		db.activity = name;
		db.activityType = type;
		db.markModified("activity");
		db.markModified("activityType");
		db.save();

		return message.channel.send(new MessageEmbed()
			.addField("Status changed", `**Type**: ${type}\n**Activity**: ${name}`)
			.withOkColor(message),
		);
	}
}