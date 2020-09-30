const { Command } = require("discord-akairo");
const { TinderHelp } = require("../../functions/embeds");

module.exports = class TinderHelpCommand extends Command {
	constructor() {
		super("tinderhelp", {
			id: "tinderhelp",
		});
	}
	async exec(message) {
		return message.util.send(TinderHelp);
	}
};