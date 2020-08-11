const { MessageEmbed } = require("discord.js");
const { UserNickTable, ParseUserObject } = require("../functions/functions.js");
const { prefix } = require("../config.js");

module.exports = {
	name: "names",
	aliases: ["name"],
	description: "Returns all your daddy nicknames",
	// args: true,
	usage: " | " + prefix + "names @someone | " + prefix + "names delete",
	cmdCategory: "Fun",
	async execute(message, args) {
		if (args[0]) {
			switch (args[0]) {
				case "del":
				case "delete":
				case "rem":
				case "remove": {
					if (UserNickTable.delete(`usernicknames.${message.member.id}`)) {
						try {
							UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
							return message.channel.send(`Deleted all of ${message.member}'s nicknames.\nWell done, you made daddy forget.`);
						}
						catch(error) {
							return console.log(error);
						}
					} 
					else {
						return message.channel.send("That didn`t work");
					}
				}
			}	
			const av =  
			message.mentions.users.first() ? message.mentions.users.first() :
				message.guild.members.cache(m => m.name === args[0]) != undefined ? message.guild.members.cache(m => m.name === args[0]) :
					message.guild.members.cache(m => m.id === args[0]) != undefined ? message.guild.members.cache(m => m.id === args[0]) :
						null;
			if (typeof av == "undefined") {
				return message.reply("Please use a proper mention.");
			}

			if (!UserNickTable.has(`usernicknames.${message.author.id}`)) {
				UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
			}
			if (!UserNickTable.has(`usernicknames.${av.id}`)) {
				UserNickTable.push(`usernicknames.${av.id}`, av.username);
			}
		}
		let AuthorDBName = UserNickTable.fetch(`usernicknames.${message.author.id}`);
		AuthorDBName = [...new Set(AuthorDBName)];	
		
		// Makes it look cleaner
		let StringsAuthorDBName = AuthorDBName.join("¤").toString();
		StringsAuthorDBName = StringsAuthorDBName.replace(/¤/g, ", ").substring(0, 2045);
		StringsAuthorDBName += "...";

		const color = message.member.displayColor;
		const embed = new MessageEmbed()
			.setTitle(`${message.author.username}'s past names`)
			.setAuthor("Daddy will never forget", "https://cdn.discordapp.com/avatars/714695773534814238/c6b61ba085b7c1ff59716d1238860e0f.png")
			.setColor(color)
			.setDescription(StringsAuthorDBName)
			.setFooter(`Delete these with ${prefix}names delete`)
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp();

		if (args[0]) {
			const av =  
			message.mentions.users.first() ? message.mentions.users.first() :
				message.guild.members.cache(m => m.name === args[0]) != undefined ? message.guild.members.cache(m => m.name === args[0]) :
					message.guild.members.cache(m => m.id === args[0]) != undefined ? message.guild.members.cache(m => m.id === args[0]) :
						null;
			let argsDBName = UserNickTable.fetch(`usernicknames.${av.id}`);
			argsDBName = [...new Set(argsDBName)];

			// Makes it look cleaner
			let StringsargsDBName = argsDBName.join("¤").toString();
			StringsargsDBName = StringsargsDBName.replace(/¤/g, ", ").substring(0, 2045);
			StringsargsDBName += "...";
			embed.setDescription(StringsargsDBName);
			embed.setTitle(`${av.username}'s past names`);
			embed.setThumbnail(av.displayAvatarURL());
		}
		const AuthorOrMention = args[0] || message.author; // Probably useless now
		if (embed.description.includes(undefined)) {
			embed.setTitle("There is nothing here");
			embed.setDescription(`${AuthorOrMention} may never have had their name changed by me`);
			embed.setFooter("\u200B");
			embed.setAuthor("Oops", "https://cdn.discordapp.com/avatars/714695773534814238/c6b61ba085b7c1ff59716d1238860e0f.png");
		}
		return message.channel.send(embed);
	},
};
