import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
import { getTinderDB } from "../struct/db";
import { tinderDataDB } from "../struct/models";
import { poems } from "./Poems";

// export class CustomEmbed extends MessageEmbed {
// 	constructor(data?: MessageEmbed | MessageEmbedOptions) {
// 		super(data);
// 	}
// }

export const tinderSlogan = ["Match?", "Chat?", "Date?", "Flirt?", "Text?", "Tease?", "Chat up?", "Take a risk?"];

// Some cringe anime wedding pictures
export const weddingImageArray = ["https://media.discordapp.net/attachments/717045059215687691/754790776893997134/L4jgWKm.jpg", "https://media.discordapp.net/attachments/717045059215687691/754790949216845824/714738.jpg", "https://media.discordapp.net/attachments/717045059215687691/754791292646457474/408146.jpg",
		"https://media.discordapp.net/attachments/717045059215687691/754791432610644008/Anime-Wedding-runochan97-33554809-1280-720.jpg", "https://media.discordapp.net/attachments/717045059215687691/754791553075249252/Anime-Wedding-runochan97-33554796-800-600.jpg",
		"https://media.discordapp.net/attachments/717045059215687691/754791700492320798/4525190-short-hair-long-hair-brunette-anime-anime-girls-love-live-love-live-sunshine-wedding-dress-b.jpg"],
	TinderHelp = (msg: Message, cmd: Command): MessageEmbed => {
		const prefix = (cmd.handler.prefix as PrefixSupplier)(msg);
		return new MessageEmbed()
			.setTitle("Tinder help page")
			.addFields(
				{ name: "Rolls and likes", value: "Using the main command (`" + prefix + "tinder`), costs a roll!\n" +
				"If you decide to react with a 💚, you spend 1 like.\n" +
				"If you react with a 🌟, you spend all your rolls and likes.", inline: true },
				{ name: "How to marry", value: "You can only marry someone you are datingIDs.\nMarrying is simple, type\n`" + prefix + "tinder marry @someone`\nThey will have to react with a ❤️, to complete the process!", inline: true },
				{ name: "Check status", value: "You can check who you have liked, disliked and who you are currently datingIDs as well as who you have married.\n`" + prefix + "tinder list` / `" + prefix + "tinder list dislikes`", inline: true },
				{ name: "Dislikes", value: "You have unlimited dislikes. You can never draw someone you have disliked.", inline: false },
				{ name: "Manage your list", value: "You can remove dislikes/likes/dates and even divorce with\n`" + prefix + "tinder remove dislikes (user_list_nr)`. Obtain their number through the list.", inline: false },
			)
			.setColor("#31e387");
	};

export async function DMEMarry(): Promise<MessageEmbed> {
	const weddingImg = weddingImageArray[Math.floor(Math.random() * weddingImageArray.length)];

	return new MessageEmbed()
		.setTitle("The wedding ceremony has begun!")
		.setColor("#e746da")
		.setURL(weddingImg)
		.setImage(weddingImg)
		.setDescription(poems[Math.floor(Math.random() * poems.length)]);
}

export async function tinderRollEmbed(message: Message, randomUsr: User, RollsLikes?: string): Promise<MessageEmbed> {
	const db = await getTinderDB(randomUsr.id),
		waifus = db.marriedIDs.length,
		likeIDsDB = await tinderDataDB.find({ tinderData: {} }),
		flattArray = likeIDsDB
			.map((ITinderData) => ITinderData.likeIDs)
			.flat(),
		randomUsrLikes = flattArray
			?.filter((id: string) => id === randomUsr.id)
			.length,
		member = message.guild?.members.cache.get(randomUsr.id);

	return new MessageEmbed()
		.withOkColor(message)
		.setAuthor(tinderSlogan[Math.floor(Math.random() * tinderSlogan.length)])
		.setTitle(randomUsr.username)
		.setDescription(member ? "**Nickname**\n" + member?.displayName : "🌐")
		.addFields(
			{ name: "**Likes**", value: randomUsrLikes ?? "None", inline: true },
			{ name: "**Waifus**", value: waifus ?? "None", inline: true },
		)
		.setFooter(RollsLikes ? "React '❌' to dislike. '💚' To like. '🌟' To super like.\n" + RollsLikes : randomUsr.tag)
		.setImage(randomUsr.displayAvatarURL({ dynamic: true, size: 128 }));
}

export const noArgRole = (message: Message): MessageEmbed => new MessageEmbed({
	description: "Can't find this role. Make sure you inputted it correctly.",
})
	.withErrorColor(message);

export const noArgGeneric = (message: Message): MessageEmbed => {
	const cmd = message.util?.parsed?.command;
	const prefix = (cmd?.handler.prefix as PrefixSupplier)(message);

	let usage = cmd?.description.usage;

	if (usage) {
		if (Array.isArray(usage)) {
			usage = usage.map(u => `${prefix}${cmd?.id} ${u}`).join("\n");
		}
		else {
			usage = `${prefix}${cmd?.id} ${usage}`;
		}
	}

	return new MessageEmbed({
		description: "Please provide (valid) arguments.",
		fields: [{ name: "Usage", value: (usage ? `${usage}` : "<any>") }],
	})
		.withErrorColor(message);
};

export const errorMessage = async (message: Message, msg: string): Promise<MessageEmbed> => new MessageEmbed({
	title: "Error",
	description: msg,
})
	.withErrorColor(message);

export const Exclude = {

	addedRoleEmbed: (rolename: string): MessageEmbed => new MessageEmbed({
		title: "Success!",
		description: `Added role \`${rolename}\`.\nType the command again to remove.`,
	}),

	removedRoleEmbed: (rolename: string): MessageEmbed => new MessageEmbed({
		title: "Success!",
		description: `Removed role \`${rolename}\`.\nType the command again to add it back.`,
	}),
};

export const reddit = {

	noDataReceived: async (m: Message): Promise<MessageEmbed> => new MessageEmbed({
		title: "Error",
		description: "No data received. Double check the subreddit's name and try again.",
	})
		.withErrorColor(m),

};