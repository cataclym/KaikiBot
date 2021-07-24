import { Message, MessageEmbed, TextChannel } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import { codeblock } from "../../lib/Util";

type argumentMessage = {
	[str: string]: string | any
} | string

export default class SayCommand extends KaikiCommand {
	constructor() {
		super("say", {
			aliases: ["say"],
			description: "Bot will send the message you typed in the specified channel. " +
				"If you omit the channel name, it will send the message in the current channel. It also takes embeds",
			usage: ["hey", "#general hello"],
			args: [{
				id: "channel",
				type: "textChannel",
				default: (m: Message) => m.channel,
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

		channel.send("Output\n" + await codeblock(JSON.stringify(argMessage, null, 4), "xl"));

		return channel.send({
			content: typeof argMessage !== "object"
				? argMessage
				: null,
			embeds: typeof argMessage === "object"
				? [new MessageEmbed(argMessage)]
				: [],
		});
	}
}

// .replace(/.+?say/, "")