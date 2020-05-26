const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Bot has finished booting sequence');
});

const { prefix } = config;


client.on('message', message => {

	const msgcnt = message.content.toLowerCase();
		
	if (message.content.toLowerCase().startsWith(`${prefix}`)) {
		message.channel.send('Hello,' + (msgcnt.slice(4)));
}
});

client.login(config.token);
