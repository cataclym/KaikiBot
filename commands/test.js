const { prefix } = require("../config.json");
const { UserNickTable } = require("../functions/functions.js");


module.exports = {
	name: "test",
	description: "",
	//args: false,
	//usage: ``,
	execute(message, args) {

		const argsDBName = UserNickTable.fetch(`usernicknames.${args[0]}`);
		const AuthorDBName = UserNickTable.fetch(`usernicknames.${message.member.id}`);   
		let strings = AuthorDBName.toString().substring(0, 2045);
		strings = strings.replace(/,/g, ", ");
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

		console.log(user.id);
	}
	,
};