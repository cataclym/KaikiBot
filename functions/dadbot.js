module.exports = {
	name: "dadbot",
	description: "// dadbot",
	async execute(message) {
		const { prefixes } = require("./variables.js");
		const foundRegex = prefixes.find(item => new RegExp("(^|\\s|$)(?<statement>(?<prefix>" + item + ")\\s*(?<nickname>.*)$)", "mi").test(item));
		if (foundRegex && !message.author.bot) {
			const { nickname } = message.content.match(foundRegex).groups;
			if (nickname.length <= 256) {
				await message.channel.send(`Hi, ${nickname}`);
				const owner = message.guild.owner;
				if (nickname.length <= 32 && message.author.id !== owner.id) //Will ignore guild owner
					message.member.setNickname(nickname).catch(error => {       //
						if (error.code) {                                         // If any error it will log it in channel, console.
							console.error('Failed to set nick due to:', error)      // Because owner is ignored already, it wont spam error in chat
							message.channel.send(`Failed to set nick due to: ${error}`, error);
						}
					});
			}
		}
	}
}
