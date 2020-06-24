const { UserNickTable } = require("../functions/functions.js");

module.exports = {
	name: "test",
	description: "",
	// args: false,
	// usage: ``,
	execute(message, args) {
		// eslint-disable-next-line no-unused-vars
		const argsDBName = UserNickTable.fetch(`usernicknames.${args[0]}`);
		const AuthorDBName = UserNickTable.fetch(`usernicknames.${message.member.id}`);
		let strings = AuthorDBName.toString().substring(0, 2045);
		strings = strings.replace(/,/g, ", ");
		// eslint-disable-next-line no-unused-vars
		strings += "...";

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
		const av = message.mentions.users.first();

		console.log(av.username, av.id);
	}
	,
};
