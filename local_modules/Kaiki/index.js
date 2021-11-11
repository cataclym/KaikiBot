const { Command } = require("discord-akairo");

class KaikiCommand extends Command {
	constructor(id, options) {
		super(id, options);
		this.usage = options?.usage;
	}
}

class KaikiUtil {
	async handleToJSON(data) {
		if (data) return data;
		throw new Error("No data was found");
	}
}

module.exports = {
	KaikiCommand,
	KaikiUtil: new KaikiUtil(),
};
