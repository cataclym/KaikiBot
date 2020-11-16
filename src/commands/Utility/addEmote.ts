// import { Buffer } from "buffer";
// import { createCanvas, loadImage } from "canvas";
// import { Argument, Command } from "discord-akairo";
// import { Emoji, Message, MessageEmbed } from "discord.js";
// import { request } from "http";
// import { errorColor, getMemberColorAsync, trim } from "../../functions/Util";
// const emoteRegex = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
// const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
// export default class AddEmoteCommand extends Command {
// 	constructor() {
// 		super("addemote", {
// 			aliases: ["addemote", "ae"],
// 			description: { description: "", usage: "" },
// 			clientPermissions: "MANAGE_EMOJIS",
// 			userPermissions: "MANAGE_EMOJIS",
// 			channel: "guild",
// 			args: [
// 				{
// 					id: "emote",
// 					type: Argument.union(imgRegex, emoteRegex),
// 				},
// 				{
// 					id: "name",
// 					type: "string",
// 					match: "rest",
// 				},
// 			],
// 		});
// 	}
// 	public async exec(message: Message, { emote, name }: { emote: string, name: string }): Promise<Message | void> {

// 		const discordEmoji = this.client.emojis.add(emote);
// 		let img;

// 		if (discordEmoji) {
// 			img = Buffer.from(discordEmoji);
// 		}
// 		else {
// 			img = request(emote);

// 		}
// 		try {

// 			const newEmote = await message.guild?.emojis.create(img, (name?.length >= 2 ? trim(name, 32) : emote.name));

// 			return message.channel.send(new MessageEmbed({

// 				title: "Success!",
// 				description: `Added \`${newEmote?.name}\`!`,
// 				color: await getMemberColorAsync(message),
// 				image: { url: newEmote?.url },
// 			}));
// 		}
// 		catch {
// 			return message.channel.send(new MessageEmbed({
// 				title: "Error",
// 				description: "Could not add this emoji. Does the current guild have space for new emoji?",
// 				color: errorColor,
// 			}));
// 		}
// 	}
// }