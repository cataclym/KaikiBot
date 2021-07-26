import { Message, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { KaikiCommand } from "kaiki";
import { errorMessage } from "../../lib/Embeds";
import { EmbedFromJson } from "../../interfaces/IGreetLeave";

type argumentMessage = {
	[str: string]: string | any
} | string

export default class SayCommand extends KaikiCommand {
	constructor() {
		super("say", {
			aliases: ["say"],
			description: "Bot will send the message you typed in the specified channel. It also takes embeds",
			usage: ["#general hello"],
			channel: "guild",
			userPermissions: Permissions.FLAGS.MANAGE_MESSAGES,
			args: [{
				id: "channel",
				type: "textChannel",
				otherwise: m => errorMessage(m, "Please provide a (valid) channel!"),
			},
			{
				id: "argMessage",
				type: (message, phrase) => {
					try {
						return JSON.parse(message.content.substring(message.content.indexOf(phrase)));
					}
					catch {
						return message.content.substring(message.content.indexOf(phrase));
					}
				},
				otherwise: (m) => new MessageEmbed()
					.setDescription("Please provide arguments!")
					.withErrorColor(m),
			}],
		});
	}

	public async exec(_: Message, { channel, argMessage }: { channel: TextChannel, argMessage: argumentMessage }): Promise<Message> {

		return channel.send(typeof argMessage !== "object"
			? 	{
				content: argMessage,
			}
			: await new EmbedFromJson(argMessage).createEmbed());
	}
}