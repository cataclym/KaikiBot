const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Bot has finished booting sequence');
	client.user.setActivity('Renai Circulation', { type: 'LISTENING'});
});

const { prefix } = config;


client.on('message', message => {
	const member = message.member;

	if (member.hasPermission('ADMINISTRATOR')) {
    switch(message.content.toUpperCase()) {
		case 'KILLNEKO':
			resetBot(message.channel);
			break;
	}
	}
	 
	const msgcnt = message.content.toLowerCase();
	
	var prefixes = ["i'm ", "im ", "i am "]
	var starts = false;
    var prefixLength = 0;
    for( i = 0; i < prefixes.length; i++){
    if (msgcnt.startsWith(prefixes[i])){
    starts = true;
    prefixLength = prefixes[i].length;
    i = prefixes.length;
  }
}
	if (starts) {
	     //if (msgcnt.startsWith(`${prefix}`)) {
		message.channel.send('Hello, ' + (message.content.slice(prefixLength)));
	   
}
});

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
	channel.send('Shutting down :(')
	.then(() => console.log('Shutting down'))
	.then(msg => process.exit(1));

}

client.login(config.token);
