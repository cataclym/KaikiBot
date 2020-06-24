const db = require("quick.db");
const { UserNickTable } = require("../functions/functions.js");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {
	name: "names",
	aliases: ["checknames","getnames","name"],
	description: "Returns all your daddy nicknames",
	//args: true,
	usage: "@someone",
	execute(message, args) {

		if (!UserNickTable.has(`usernicknames.${message.author.id}`||`usernicknames.${user.id}`)) {
			UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
		}
		function getUserFromMention(mention) {
			if (!mention) return;
        
			if (mention.startsWith("<@") && mention.endsWith(">")) {
				mention = mention.slice(2, -1);
        
				if (mention.startsWith("!")) {
					mention = mention.slice(1);
				}
				return message.guild.members.cache.get(mention);
			}
		}
		const user = getUserFromMention(args[0]);
		const AuthorDBName = UserNickTable.fetch(`usernicknames.${message.author.id}`);
		// Makes it look cleaner
		let StringsAuthorDBName = AuthorDBName.toString().substring(0, 2045);
		StringsAuthorDBName = StringsAuthorDBName.replace(/,/g, ", ");
		StringsAuthorDBName += "...";   

		const av = message.mentions.users.first();
		const color = message.member.displayColor;

		if (args[0] && !user) {
			return message.reply("Please use a proper mention.");
		}             
		const embed = new MessageEmbed()
			.setTitle(`${message.author.username}'s past names`)
			.setAuthor("Daddy will never forget", "https://cdn.discordapp.com/avatars/714695773534814238/c6b61ba085b7c1ff59716d1238860e0f.png",)
			.setColor(color)
			.setDescription("name here")
			.setFooter(`Delete these with ${prefix}delnames`)
			.setTimestamp();
		if (!args[0]){
			embed.setThumbnail(message.author.displayAvatarURL());
			embed.setDescription(StringsAuthorDBName);
		}   
		if (args[0]){
			const argsDBName = UserNickTable.fetch(`usernicknames.${user.id}`);
			// Makes it look cleaner
			let StringsargsDBName = argsDBName.toString().substring(0, 2045);
			StringsargsDBName = StringsargsDBName.replace(/,/g, ", ");
			StringsargsDBName += "...";
			embed.setDescription(StringsargsDBName);
			embed.setTitle(`${av.username}'s past names`);
			embed.setThumbnail(av.displayAvatarURL());
		}      
		const AuthorOrMention = args[0] || message.author;
		if (embed.description.includes(undefined)) {
			embed.setTitle("There is nothing here");
			embed.setDescription(`${AuthorOrMention} may never have had their name changed by me`);
			embed.setFooter("\u200B");
			embed.setAuthor("Oops", "https://cdn.discordapp.com/avatars/714695773534814238/c6b61ba085b7c1ff59716d1238860e0f.png");
		}
        
		return message.channel.send(embed);
	},
};