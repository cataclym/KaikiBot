const { MessageEmbed } = require("discord.js");
const { UserNickTable } = require("../../functions/functions.js");
const { prefix } = require("../../config.js");
const paginationEmbed = require("discord.js-pagination");
const { Command, Argument } = require("discord-akairo");


module.exports = class NamesCommand extends Command {
	constructor() {
		super("names", {
			name: "names",
			aliases: ["name", "names"],
			description: { description: "Returns all your daddy nicknames", usage: " | " + prefix + "names @someone | " + prefix + "names delete" },
		});
	}
	*args() {
		const method = yield {
			type: async (message, phrase) => {
				const arr = ["remove", "rem", "delete", "del"];
				if (arr.includes(phrase)) {
					return true;
				}
			},
		};
		const user = yield {
			index: 0,
			type: Argument.union("member", "user"),
		};
		return { user, method };
	}

	async exec(message, args) {
		const color = message.member.displayColor;
		const user = args?.user?.user || message.author;

		if (args.method) {
			try {
				if (UserNickTable.delete(`usernicknames.${message.member.id}`)) {

					UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
					return message.util.send(`Deleted all of ${message.member}'s nicknames.\nWell done, you made daddy forget.`);
				}
			}
			catch (error) {
				return console.log(error);
			}
		}
		if (!UserNickTable.has(`usernicknames.${user.id}`)) {
			UserNickTable.push(`usernicknames.${user.id}`, user.username);
		}
		let AuthorDBName = UserNickTable.fetch(`usernicknames.${user.id}`);
		AuthorDBName = [...new Set(AuthorDBName)];

		// Makes it look cleaner
		let StringsAuthorDBName = AuthorDBName.join("¤").toString();
		StringsAuthorDBName = StringsAuthorDBName.replace(/¤/g, ", ");

		const pages = [];
		for (let i = 2047, p = 0; p < StringsAuthorDBName.length; i = i + 2047, p = p + 2047) {
			const dEmbed = new MessageEmbed()
				.setTitle(`${user.username}'s past names`)
				.setColor(color)
				.setThumbnail(user.displayAvatarURL({ dynamic: true }))
				.setDescription(StringsAuthorDBName.slice(p, i));
			pages.push(dEmbed);
		}
		return paginationEmbed(message, pages);
	}
};
