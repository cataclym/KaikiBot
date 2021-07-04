// import { Argument, Command } from "discord-akairo";
// import { Message, TextChannel } from "discord.js";
// import db from "quick.db";
// const guildConfig = new db.table("guildConfig");

// export default class ChannelLetterConfigCommand extends Command {
// 	constructor() {
// 		super("config-channel", {
// 			clientPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
// 			userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
// 			description: { description: "", usage: ["<channel> <single letter>", "", "disable"] },
// 			channel: "guild",
// 		});
// 	}
// 	*args(): Generator<{
// 		type: string;
// 	}, unknown, unknown> {
// 		const channel = yield {
// 			type: "channel",
// 		};

// 		const letter = yield {
// 			type: "string",
// 		};
// 		if (Argument.isFailure(channel) && Argument.isFailure(letter) || Argument.isFailure(letter) || Argument.isFailure(channel)) {
// 			return;
// 		}
// 		else {
// 			return channel && letter;
// 		}
// 	}
// 	public async exec(message: Message, { channel, letter }: { channel: TextChannel, letter: string }): Promise<Message | undefined> {

// 		const currentChannel: string[] | undefined = guildConfig.get(`letter-channels.${message.guild?.id}`);

// 		if (currentChannel && currentChannel[0]) {
// 			return message.channel.send("");
// 		}
// 		else if (letter) {
// 			guildConfig.push(`letter-channels.${message.guild?.id}`, [channel, letter]);
// 			return message.channel.send("");
// 		}
// 	}
// }
