const { prefix } = require("../config");


module.exports = {
	name: "test",
	description: "",
	args: true,
	// usage: ``,
	execute(message, args) {
		message.channel.send("This didn't work.");
	},
};
