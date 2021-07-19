import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { hexColorTable } from "../Color";

type endPointSignatures = "run"
    | "peek"
    | "pout";


const token = process.env.KAWAIIKEY;

const endPoints: {
	[str in endPointSignatures]: { action: string | boolean, color: ColorResolvable | string, append?: string }
} = {
	"run": {
		action: "is running away!!",
		color: hexColorTable["chartreuse"],
	},
	"peek": {
		action: "peeks",
		color: hexColorTable["papayawhip"],
		append: "👀",
	},
	"pout": {
		action: "pouts",
		color: hexColorTable["darkseagreen"],
		append: "😒",
	},
};

export default async function getKawaiiResponseEmbed(message: Message, endpoint: endPointSignatures, mention?: GuildMember | null): Promise<MessageEmbed | undefined> {

	if (!token) {
		return;
	}

	const data = endPoints[endpoint];
	const { action, color, append } = data;
	const result = (await (await fetch(`https://kawaii.red/api/gif/${endpoint}/token=${token}`)).json())["response"];
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
