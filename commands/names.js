const { MessageEmbed } = require("discord.js");
const { UserNickTable, ParseUserObject } = require("../functions/functions.js");
const { prefix } = require("../config.js");
const paginationEmbed = require("discord.js-pagination");

module.exports = {
	name: "names",
	aliases: ["name"],
	description: "Returns all your daddy nicknames",
	// args: true,
	usage: " | " + prefix + "names @someone | " + prefix + "names delete",
	cmdCategory: "Fun",
	async execute(message, args) {
		const color = message.member.displayColor;
		const user = ParseUserObject(message, args);
		if (!args[0]) {
		// ez service
			if (!UserNickTable.has(`usernicknames.${message.author.id}`)) {
				UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
			}
			let AuthorDBName = UserNickTable.fetch(`usernicknames.${message.author.id}`);
			AuthorDBName = [...new Set(AuthorDBName)];

			// Makes it look cleaner
			let StringsAuthorDBName = AuthorDBName.join("¤").toString();
			StringsAuthorDBName = StringsAuthorDBName.replace(/¤/g, ", ");

			const pages = [];
			for (let i = 2047, p = 0; p < StringsAuthorDBName.length; i = i + 2047, p = p + 2047) {
				const dEmbed = new MessageEmbed()
					.setTitle(`${message.author.username}'s past names`)
					.setColor(color)
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(StringsAuthorDBName.slice(p, i));
				pages.push(dEmbed);
			}
			return paginationEmbed(message, pages);
		}
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
					catch (error) {
						return console.log(error);
					}
				}
				else {
					return message.channel.send("That didn`t work");
				}
			}
			default: {
				if (!user) {
					return message.channel.send("Not a user or not a valid argument");
				}
				else if (!UserNickTable.has(`usernicknames.${user.id}`)) {
					UserNickTable.push(`usernicknames.${user.id}`, user.username);
				}
				let argsDBName = UserNickTable.fetch(`usernicknames.${user.id}`);
				argsDBName = [...new Set(argsDBName)];

				// Makes it look cleaner
				let StringsargsDBName = argsDBName.join("¤").toString();
				StringsargsDBName = StringsargsDBName.replace(/¤/g, ", ");

				const pages = [];
				for (let i = 2047, p = 0; p < StringsargsDBName.length; i = i + 2047, p = p + 2047) {
					const dEmbed = new MessageEmbed()
						.setTitle(`${user.username}'s past names`)
						.setColor(color)
						.setThumbnail(user.displayAvatarURL())
						.setDescription(StringsargsDBName.slice(p, i));
					pages.push(dEmbed);
				}
				return paginationEmbed(message, pages);
			}
		}
	},
};
