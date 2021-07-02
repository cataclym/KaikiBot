import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { hexColorTable } from "./Color";

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
    | "shinobu"
	| "nom"
	| "slap";

const WaifuData: {
        [str in APIs]: { action: string | boolean, color: ColorResolvable | String, append?: string }
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
			color: hexColorTable["hotpink"],
			append: "♥️",
		},
		"nom": {
			action: "nommed",
			color: hexColorTable["mediumseagreen"],
		},
		"slap": {
			action: "slapped",
			color: hexColorTable["pink"],
			append: "👋",
		},
	};

export default async function sendWaifuPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<MessageEmbed> {

	const data = WaifuData[API];
	const { action, color, append } = data;

	const result = (await (await fetch(`https://api.waifu.pics/sfw/${API}`)).json())["url"];

	const embed = new MessageEmbed({
		color: color as ColorResolvable,
		image: { url: result },
		footer: { icon_url: (mention?.user || message.author).displayAvatarURL({ dynamic: true }) },
	});

	if (mention && action) {
		embed.setDescription(`${message.author.username} ${action} ${mention.user.username} ${append ?? ""}`);
	}

	return embed;
}

