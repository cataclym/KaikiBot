import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { hexColorTable } from "./Color";

type APIs = "spank";

const NekosData: {
        [str in APIs]: { action: string | boolean, color: ColorResolvable | string, append?: string }
	} = {
		"spank": {
			action: "spanked",
			color: hexColorTable["peachpuff"],
			append: "🍑👋",
		},
	};

export default async function sendNekosPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<MessageEmbed> {

	const data = NekosData[API],
		{ action, color, append } = data,
		result = await (await (await fetch(`https://nekos.life/api/v2/img/${API}`)).json())["url"],
		embed = new MessageEmbed({
			color: color as ColorResolvable,
			image: { url: result },
			footer: { icon_url: (mention?.user || message.author).displayAvatarURL({ dynamic: true }) },
		});

	if (mention && action) {
		embed.setDescription(`${message.author.username} ${action} ${mention.user.username} ${append ?? ""}`);
	}

	return embed;
}

