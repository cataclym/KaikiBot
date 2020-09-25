const { Command } = require("discord-akairo");
const db = require("quick.db");
const restorables = new db.table("restorables");

module.exports = class RestoreUserRoles extends Command {
	constructor() {
		super("restore", {
			id: "restore",
			aliases: ["restore"],
			ownerOnly: true,
			description: { description: "Restores roles for a user who has previously left the server.", usage: "@dreb",
				args: [
					{
						id:"member",
						type: "member",
					},
				],
			},
		});
	}
	async exec(message) {
		return;
	}
};