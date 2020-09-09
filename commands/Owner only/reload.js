const { Command } = require("discord-akairo");

module.exports = class ReloadCommand extends Command {
	constructor() {
		super("reload", {
			name: "reload",
			aliases: ["re", "reload"],
			description: { description: "Reloads a command" },
			ownerOnly: true,
		});
	}
	async exec(message, args) {
		return;
		// TODO: Convert to Akairo reload
		if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
		const commandName = await args[0].toLowerCase();
		const command = await message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			await message.client.commands.set(newCommand.name, newCommand);
			await message.react("✅");
		}
		catch (error) {
			console.log(error);
			await message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	}
};