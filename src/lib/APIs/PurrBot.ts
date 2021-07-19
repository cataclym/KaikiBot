import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { hexColorTable } from "../Color";

type endPointSignatures = "bite"
	| "blush"
	| "feed";

const endPoints: {
	[str in endPointSignatures]: { action: string | boolean, color: ColorResolvable | string, append?: string }
} = {
	"bite": {
		action: "just bit",
		color: hexColorTable["crimson"],
		append: "!!!",
	},
	"blush": {
		action: "blushed",
		color: hexColorTable["mediumorchid"],
	},
	"feed": {
		action: "fed",
		color: hexColorTable["springgreen"],
		append: "🍖",
	},
};

export default async function getPurrBotResponseEmbed(message: Message, endpoint: endPointSignatures, mention?: GuildMember | null): Promise<MessageEmbed> {

	const data = endPoints[endpoint];
	const { action, color, append } = data;
	const result = (await (await fetch(`https://purrbot.site/api/img/sfw/${endpoint}/gif`)).json())["link"];
	const embed = new MessageEmbed({
		color: color as ColorResolvable,
		image: { url: result },
		footer: { icon_url: (mention?.user || message.author).displayAvatarURL({ dynamic: true }) },
	});

	if (mention && action) {
		embed.setDescription(`${message.author.username} ${action} ${mention.user.username} ${append ?? ""}`);
	}

	else if (action) {
		embed.setDescription(`${message.author.username} ${action} ${append ?? ""}`);
	}

	return embed;
}

