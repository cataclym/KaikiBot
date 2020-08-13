module.exports = {
	name: "send",
	description: "Sends your desired msg",
	aliases: ["s","eval"],
	args: false,
	usage: "$ {stuff_here}",
	cmdCategory: "WIP (Useless)",
	execute(message) { // Still have no idea how to do this
		return message.channel.send("WIP");
	},
};
