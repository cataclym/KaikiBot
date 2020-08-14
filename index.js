/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const Discord = require("discord.js");
const fs = require("fs");
const { ReAssignBirthdays, GuildOnAddBdays } = require("./functions/AnniversaryRoles");
const { TinderStartup, TinderDBService } = require("./functions/tinder");
const { prefix, token, activityname, activitystatus, ownerID } = require("./config.js");
const client = new Discord.Client({
	"shards" : "auto",
	"disableMentions": "everyone",
});
const {
	emotereact, rolecheck, handleMentions, dadbot, TiredNadeko, DailyResetTimer,
	EmoteDBStartup, countEmotes, CommandUsage,
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
	await client.user.setActivity(activityname, { type: activitystatus });
	await DailyResetTimer();
	await EmoteDBStartup(client);
	await ReAssignBirthdays(client);
	client.guilds.cache.forEach(g => {
		// This will spam Console on first boot.
		TinderStartup(g);
	});
});

client.on("guildCreate", async (guild) => {
	console.log("\nBot was added to " + guild.name + "!! " + guild.memberCount + " members!\n");
	await TinderStartup(guild);
	await EmoteDBStartup(client);
	await GuildOnAddBdays(guild);
});
client.on("guildMemberAdd", async (member) => {
	TinderDBService(member);
});

client.on("message", async (message) => {

	await TiredNadeko(message);
	if(message.channel.name !== undefined) {
		// Guild only
		if (message.webhookID) return;
		await countEmotes(message);
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
	if (!command || (command.cmdCategory === "Owner only" && message.author.id !== ownerID)) return;

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
				.then(SentMSG => {
					setTimeout(() => { SentMSG.delete(); }, 5000);
				});
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
		const IsArgs = args.length ? "With args: " + args.join(" ") : "No args";
		console.log("------------------------------------------------------------------|\n" +
		message.author.username + " executed " + command.name + " | " + IsArgs + "\nIn " + message.guild.name + " : " + message.channel.name + "\nAt " + Date());
	}
	catch (error) {
		console.error(error);
		await message.reply(`Error, ${error}`);
	}
});

client.login(token);
