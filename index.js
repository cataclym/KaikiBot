const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');
const { prefixes2, emotenames, activityname, activitystatus } = require("./variables.js");
//const functions = require('./functions/functions');
const { rolecheck, handleMentions, dadbot } = require("./functions/functions");
//Could go back to the names array for excluding multiple roles

// Loads commands and sets their command execution
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
//These are the functions I want to load from "./functions/functions.js" Or alternatively their own files there...
if (rolecheck(message)) // This is the check for excluded role.
return;

(handleMentions(message));
(dadbot(message));

  for (const item of prefixes2)
  { //pulls the prefixes2 array
    const r = new RegExp("(^|\\s|$)(?<statement>(?<prefix>" + item + ")\\s*(?<nickname>.*)$)", "mi"); //regexp same as the one for dadbot command.
    if (r.test(message.content) && !message.author.bot) 
    {
    let randomEmote = Math.floor(Math.random() * emotenames.length); 
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === emotenames[randomEmote]);
    message.react(emoji);
  }
}
// Handles commands that require the prefix from config
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
