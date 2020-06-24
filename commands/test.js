const { prefix } = require('../config.json');
module.exports = {
	name: "test",
	description: "",
	args: false,
	usage: `${prefix}test`,
	execute(message) {
		message.channel.send("Fck u want?");
	}
	,
}
