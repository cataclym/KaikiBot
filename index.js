const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');
//const { names } = require("./commands/variables.js");
const { prefixes } = require("./commands/variables.js");
const { prefixes2 } = require("./commands/variables.js");
const { emotenames } = require("./commands/variables.js");
const { activityname } = require("./commands/variables.js");
const { activitystatus } = require("./commands/variables.js");

client.once('ready', () => {
	console.log('Bot has finished booting sequence');
	client.user.setActivity(`${activityname}`, { type: `${activitystatus}`});
});

const { prefix } = config;

client.on('message', message => {

    const member = message.member;
	const msgcnt = message.content.toLowerCase();
        try {
			const specialString = JSON.parse(fs.readFileSync("./storage/names.json", "utf8"));
			if(message.member.roles.cache.find(r => r.name === specialString.name)) { 
		
				console.log("Role checked:", specialString.name);
				return;
				}
			}
			catch(err) {
				console.log("Error parsing JSON string:", err);
			
			} 
	
    if (member.hasPermission('ADMINISTRATOR')) {
		if (!message.content.startsWith(prefix) || message.author.bot) return; {
			const args = message.content.slice(prefix.length).split(' ');
			const command = args.shift().toLowerCase();
			if (command === 'die') {
            resetBot(message.channel);
			}
		}
    }
	
	
    const user = message.author;
    if (message.mentions.has(client.user)) {
        message.channel.startTyping(100)
        .then(message.channel.send(`Hi ${user}, what is up?`))
        .then(message.channel.stopTyping(true));
    }
for(const item of prefixes){
  const r = new RegExp("(^|\\s|$)(?<statement>(?<prefix>"+item+")\\s*(?<nickname>.*)$)", "mi");
  if(r.test(message.content) && !message.author.bot) {
	const { statement, prefix, nickname } = message.content.match(r).groups;
    if(nickname.length <= 256) {
      message.channel.send(`Hi, ${nickname}`);
      if(nickname.length <= 32)
        message.member.setNickname(nickname);
	}

    break;
  }
}
	   
let contains2 = false;
    for( i = 0; i < prefixes2.length; i++){
        let regex = new RegExp('\\b' + prefixes2[i] + '\\b');
        let index = msgcnt.search(regex)
    if (index >= 0){
		contains2 = true;
		prefixLength = prefixes2[i].length;
        prefixIndex = index;
        i = prefixes2.length;
  }
}
    if (contains2) {
		let randomEmote = Math.floor(Math.random()*emotenames.length);
        const emoji = message.guild.emojis.cache.find(emoji => emoji.name === emotenames[randomEmote]);
	    message.react(emoji);
       
}
});

// Turn bot off, then turn it back on.
function resetBot(channel) {
    // send channel a message that you're resetting bot.
	channel.send('Shutting down :(')
	.then(() => console.log('Shutting down'))
	.then(msg => process.exit(1));

}

client.login(config.token);
