const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.js");
const { poems } = require("../functions/poems.js");

const TinderHelp = new MessageEmbed()
	.setTitle("Tinder help page")
	.addFields(
		{ name: "Rolls and likes", value: "Using the main command (`" + prefix + "tinder`), costs a roll!\n" +
				"If you decide to react with a 💚, you spend 1 like.\n" +
				"If you react with a 🌟, you spend all your rolls and likes.", inline: true },
		{ name: "How to marry", value: "You can only marry someone you are dating.\nMarrying is simple, type `" + prefix + "tinder marry @someone`\nThey will have to react with a ❤️, to complete the process!", inline: true },
		{ name: "Check status", value: "You can check who you have liked, disliked and who you are currently dating as well as who you have married.\n`" + prefix + "tinder list`", inline: true },
		{ name: "Dislikes", value: "You have unlimited dislikes. You can never draw someone you have disliked.\n" +
				"If you accidentally disliked someone, you can delete them from dislikes with\n`" + prefix + "tinder remove (user_list_nr)`. Obtain their number through the list.", inline: false },
	)
	.setColor("#31e387");

// Some cringe anime wedding pictures // Some will likely stop loading within a year lol
// todo re-upload images to imgur or discord.

function DMEMarry() {
	const WeddingIMGArray = ["https://i.imgur.com/L4jgWKm.jpg", "https://images8.alphacoders.com/714/714738.jpg", "https://images7.alphacoders.com/408/408146.jpg",
		"http://images6.fanpop.com/image/photos/33500000/Anime-Wedding-runochan97-33554809-1280-720.jpg", "http://images6.fanpop.com/image/photos/33500000/Anime-Wedding-runochan97-33554796-800-600.jpg",
		"https://cdn.discordapp.com/attachments/717045059215687691/739277167455633438/4525190-short-hair-long-hair-brunette-anime-anime-girls-love-live-love-live-sunshine-wedding-dress-b.jpg"];

	const RandomWeddingImg = WeddingIMGArray[Math.floor(Math.random() * WeddingIMGArray.length)];
	const Rpoem = poems[Math.floor(Math.random() * poems.length)];

	return new MessageEmbed()
		.setTitle("The wedding ceremony has begun!")
		.setColor("#e746da")
		.setURL(RandomWeddingImg)
		.setImage(RandomWeddingImg)
		.setDescription(Rpoem);
}
function tinderRollEmbed(message, RandomUsr, RollsLikes) {
	const TinderSlogan = ["Match?", "Chat?", "Date?", "Flirt?", "Text?", "Tease?", "Chat up?", "Take a risk?"];
	const RandomTinderS = TinderSlogan[Math.floor(Math.random() * TinderSlogan.length)];
	return new MessageEmbed()
		.setColor(message.member.displayColor)
		.setAuthor(RandomTinderS)
		.setTitle(RandomUsr.username)
		.setDescription(message.guild.members.cache.find(u => u.id === RandomUsr.id) ? message.guild.members.cache.find(u => u.id === RandomUsr.id).displayName : "\u200B")
		.setFooter(RollsLikes ? "React '❌' to dislike. '💚' To like. '🌟' To super like.\n" + RollsLikes : RandomUsr.tag)
		.setImage(RandomUsr.displayAvatarURL({ dynamic: true }));
}
module.exports = {
	DMEMarry, TinderHelp, tinderRollEmbed,
};