const { Command, CommandOptions } = require("discord-akairo");

class KaikiCommand extends Command {
	constructor(id, options) {
		super(id, options);
		this.usage = options?.usage;
	}
}

module.exports = {
	KaikiCommand,
};
