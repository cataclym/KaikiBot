const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');
const { activityname, activitystatus } = require("./variables.js");
const { emotereact, rolecheck, handleMentions, dadbot } = require("./functions/functions");
//Could go back to the names array for excluding multiple roles

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
// boot
client.once('ready', () => {
	console.log('Bot has finished booting sequence');
	client.user.setActivity(`${activityname}`, { type: `${activitystatus}` });
});

client.on('message', message => {

	(handleMentions(message)); // Responds when pinged
	(emotereact(message)); // Reacts to prefixes2 with emotenames
	if (!rolecheck(message)) // This is the check for excluded role.
		(dadbot(message)); // Handles "I am"

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	//if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;


	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply(`Error, ${error}`);
	}
});

client.login(token);
