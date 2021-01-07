import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../../nsb/Color";
import fetch from "node-fetch";

type APIs = "waifu"
    | "neko"
    | "shinobu"
    | "megumin"
    | "bully"
    | "cuddle";

const WaifuData: {
        [str in APIs]: { action: string | boolean, color: ColorResolvable, name: APIs }
	} = {
		"waifu": { action: false,
			color: hexColorTable["peachpuff"],
			name: "waifu" },
		"neko": { action: false,
			color: hexColorTable["royalblue"],
			name: "neko" },
		"shinobu": { action: false,
			color: hexColorTable["lightyellow"],
			name: "shinobu" },
		"megumin": { action: false,
			color: hexColorTable["mediumvioletred"],
			name: "megumin" },
		"bully": { action: "bullies",
			color: hexColorTable["darkorchid"],
			name: "bully" },
		"cuddle": { action: "cuddled",
			color: hexColorTable["seagreen"],
			name: "cuddle" },
	};

export default async function sendWaifuPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<MessageEmbed> {

	const { action, color, name } = WaifuData[API];

	const result = (await (await fetch(`https://waifu.pics/api/sfw/${name}`)).json())["url"];

	const embed = new MessageEmbed({
		color: color,
		image: { url: result },
		author: { name: "URL", url: result, icon_url: (mention?.user || message.author).displayAvatarURL({ dynamic: true }) },
	});

	if (mention && action) {
		embed.setDescription(`${message.author.username} ${action} ${mention.user.username}`);
	}

	return embed;
}

