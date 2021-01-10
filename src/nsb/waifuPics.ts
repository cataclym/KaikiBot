import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "./Color";
import fetch from "node-fetch";

type APIs = "bonk"
	| "cry"
	| "cuddle"
	| "hug"
	| "kiss"
	| "lick"
	| "pat"
	| "waifu"
	| "yeet"
    | "bully"
    | "megumin"
    | "neko"
    | "shinobu";

const WaifuData: {
        [str in APIs]: { action: string | boolean, color: ColorResolvable, append?: string }
	} = {
		"waifu": {
			action: false,
			color: hexColorTable["peachpuff"],
		},
		"neko": {
			action: false,
			color: hexColorTable["royalblue"],
		},
		"shinobu": {
			action: false,
			color: hexColorTable["lightyellow"],
		},
		"megumin": {
			action: false,
			color: hexColorTable["mediumvioletred"],
		},
		"cry": {
			action: false,
			color: hexColorTable["dodgerblue"],
		},
		"bully": {
			action: "bullies",
			color: hexColorTable["darkorchid"],
		},
		"cuddle": {
			action: "cuddled",
			color: hexColorTable["seagreen"],
		},
		"hug": {
			action: "hugged",
			color: hexColorTable["plum"],
		},
		"lick": {
			action: "licked",
			color: hexColorTable["mediumpurple"],
		},
		"pat": {
			action: "patted",
			color: hexColorTable["mintcream"],
			append: "✨",
		},
		"bonk": {
			action: "bonked",
			color: hexColorTable["maroon"],
			append: "🏏",
		},
		"yeet": {
			action: "yeeted",
			color: hexColorTable["lawngreen"],
			append: "👋",
		},
		"kiss": {
			action: "kissed",
			color: hexColorTable[""],
			append: "♥️",
		},
	};

export default async function sendWaifuPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<MessageEmbed> {

	const data = WaifuData[API];
	const { action, color, append } = data;

	const result = await (await (await fetch(`https://waifu.pics/api/sfw/${API}`)).json())["url"];

	const embed = new MessageEmbed({
		color: color,
		image: { url: result },
		author: { name: "URL", url: result, icon_url: (mention?.user || message.author).displayAvatarURL({ dynamic: true }) },
	});

	if (mention && action) {
		embed.setDescription(`${message.author.username} ${action} ${mention.user.username} ${append ?? ""}`);
	}

	return embed;
}

