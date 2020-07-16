/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const Discord = require("discord.js");
const fs = require("fs");
const { prefix, token, activityname, activitystatus } = require("./config.js");

const client = new Discord.Client();
const {
	emotereact, rolecheck, handleMentions, dadbot, TiredNadeko, DailyResetTimer
} = require("./functions/functions");

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// boot
client.once("ready", async () => {
	console.log("Bot has finished booting sequence");
	client.user.setActivity(`${activityname}`, { type: `${activitystatus}` });
	DailyResetTimer();
});

client.on("message", async (message) => {

	TiredNadeko(message);
	if(message.channel.name != undefined) { // Guild only
		if (message.webhookID) return;
		handleMentions(message);
		emotereact(message);
		if (!rolecheck(message)) {
			dadbot(message);
		}
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// eslint-disable-next-line max-len
	const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		// eslint-disable-next-line consistent-return
		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
				.then(sentmsg => {
					setTimeout(() => { sentmsg.delete(); }, 5000);
				});
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	try {
		command.execute(message, args);
		console.log(message.author.username + " executed " + command.name + " | With args: (" + args + ")\nAt " + Date());
	} catch (error) {
		console.error(error);
		message.reply(`Error, ${error}`);
	}
});

client.login(token);
