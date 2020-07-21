const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.js");

const TinderHelp = new MessageEmbed()
	.setTitle("Tinder help page")
	.addFields(
		{ name: "Rolls and likes", value: "Using the main command (`" + prefix + "tinder`), costs a roll!\nIf you decide to react with a 💚, you spend 1 like.\nIf you react with a 🌟, you spend all your rolls and likes.", inline: true },
		{ name: "How to marry", value: "You can only marry someone you are dating.\nMarrying is simple, type `" + prefix + "tinder marry @someone`\nThey will have to react with a ❤️, to complete the process!", inline: true },
		{ name: "Check status", value: "You can check who you have liked, disliked and who you are currently dating as well as who you have married.\n`" + prefix + "tinder list`", inline: true },
	)
	.setColor("#31e387")
	.setImage();

const DMEMarry = new MessageEmbed()
	.setTitle("The wedding ceremony has begun!")
	.setColor("#e746da")
	.setURL("http://images6.fanpop.com/image/photos/33500000/Anime-Wedding-runochan97-33554806-1412-1000.jpg")
	.setImage("http://images6.fanpop.com/image/photos/33500000/Anime-Wedding-runochan97-33554806-1412-1000.jpg");

module.exports = {
	DMEMarry, TinderHelp
};