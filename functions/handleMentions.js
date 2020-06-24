module.exports = {
	name: "handleMentions",
	description: "handle mentions",
	execute(message) {
		if (message.mentions.has(message.client.user)) {
			message.channel.startTyping(100)
				.then(message.channel.send(`Hi ${message.author}, what is up?`))
				.then(message.channel.stopTyping(true));
		}
	},
};