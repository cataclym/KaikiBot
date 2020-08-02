/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const Discord = require("discord.js");
const fs = require("fs");
const { TinderStartup, TinderDBService} = require("./functions/tinder");
const { prefix, token, activityname, activitystatus } = require("./config.js");

const client = new Discord.Client();
const {
	emotereact, rolecheck, handleMentions, dadbot, TiredNadeko, DailyResetTimer,
	EmoteDBStartup, countEmotes, CommandUsage
} = require("./functions/functions");

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once("ready", async () => {
	console.log("Client ready");
	await client.user.setActivity(activityname, {type: activitystatus});
	DailyResetTimer();
	EmoteDBStartup(client);
	client.guilds.cache.forEach(g => { // This will spam Console on first boot.
		TinderStartup(g);
	});
});

client.on("guildCreate", async  (guild) => {
	TinderStartup(guild);
	EmoteDBStartup(client);
});
client.on("guildMemberAdd", async  (member) => {
	TinderDBService(member);
});

client.on("message", async (message) => {

	await TiredNadeko(message);
	if(message.channel.name !== undefined) { // Guild only 
		if (message.webhookID) return;
		countEmotes(message);
		await handleMentions(message);
		await emotereact(message);
		if (!rolecheck(message)) {
			dadbot(message);
		}
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.args && !args.length) {
		return CommandUsage(message, command);
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
		console.log("------------------------------------------------------------------|\n" +
		message.author.username + " executed " + command.name + " | With args: (" + args + ")\nAt " + Date());
	} catch (error) {
		console.error(error);
		await message.reply(`Error, ${error}`);
	}
});

client.login(token);
