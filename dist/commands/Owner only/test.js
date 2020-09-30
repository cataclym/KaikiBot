const { Command } = require("discord-akairo");
const reactions = ["🟥", "🟨", "🟩"];
module.exports = class TestCommand extends Command {
	constructor() {
		super("test", {
			name: "test",
			aliases: ["test"],
			ownerOnly: true,
		});
	}
	async exec(message) {
		console.time();
		const thing = await message.util.send("test message");
		Promise.all(reactions.map(async (reaction) => {
			thing.react(reaction);
		})).then(console.timeEnd());
	}
};
