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

if (rolecheck(message)) // This is the check for excluded role.
return;
(handleMentions(message)); // Responds when pinged
(dadbot(message)); // Handles "I am" 
(emotereact(message)); // Reacts to prefixes2 with emotenames

  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(message, args);  
	} catch (error) {
		console.error(error);
		message.reply(`Error, ${error}`);
	}
});

client.login(token);
