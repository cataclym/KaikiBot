const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');
const { prefixes, prefixes2, emotenames, activityname, activitystatus } = require("./commands/variables.js");

// boot
client.once('ready', () => {
  console.log('Bot has finished booting sequence');
  client.user.setActivity(`${activityname}`, { type: `${activitystatus}` });
});

// handle commands
client.on('message', message => {

  const args = message.content.slice(config.prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'die' && message.member.hasPermission('ADMINISTRATOR')) {
    resetBot(message.channel);
  }
  let contains2 = false;
  for (i = 0; i < prefixes2.length; i++) {
    let regex = new RegExp('\\b' + prefixes2[i] + '\\b');
    let index = message.content.toLowerCase().search(regex);
    if (index >= 0) {
      contains2 = true;
      prefixLength = prefixes2[i].length;
      prefixIndex = index;
      i = prefixes2.length;
    }
  }
  if (contains2) {
    let randomEmote = Math.floor(Math.random() * emotenames.length);
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === emotenames[randomEmote]);
    message.react(emoji);
  }
  let contains3 = false;
  for (i = 0; i < prefixes2.length; i++) {
    let regex = new RegExp('\\b' + prefixes2[i] + '\\b');
    let index2 = message.content.toLowerCase().search(regex, index2+1);
    if (index2 >= 0) {
      contains3 = true;
      prefixLength = prefixes2[i].length;
      prefixIndex = index2;
      i = prefixes2.length;
    }
  }
  if (contains3) {
    const emotes = message.guild.emojis.map(e => e.toString());
    let randomEmote = Math.floor(Math.random() * emotes.length);
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === emotes[randomEmote]);
    message.react(emoji).repeat(8);
    
  }

  if (rolecheck(message))
    return;

  handleMentions(message);
  dadbot(message);

  if (!message.content.startsWith(config.prefix) || message.author.bot)
    return;  
});

// handle mentions
function handleMentions(message) {
  if (message.mentions.has(client.user)) {
    message.channel.startTyping(100)
      .then(message.channel.send(`Hi ${message.author}, what is up?`))
      .then(message.channel.stopTyping(true));
  }
};

// dadbot
function dadbot(message) {
  for (const item of prefixes) {
    const r = new RegExp("(^|\\s|$)(?<statement>(?<prefix>" + item + ")\\s*(?<nickname>.*)$)", "mi");
    if (r.test(message.content) && !message.author.bot) {
      const { nickname } = message.content.match(r).groups;
      if (nickname.length <= 256) {
        message.channel.send(`Hi, ${nickname}`);
        if (nickname.length <= 32)
          message.member.setNickname(nickname);
      }
      break;
    }
  }
};

// check for special role
function rolecheck(message) {
  const specialString = JSON.parse(fs.readFileSync("./storage/names.json", "utf8"));
  if (message.member.roles.cache.find(r => r.name === specialString.name)) {
    console.log("Role checked:", specialString.name);
    return true;
  }
  return false;
}

// Turn bot off, then turn it back on.
function resetBot(channel) {
  // send channel a message that you're resetting bot.
  channel.send('Shutting down :(')
    .then(() => console.log('Shutting down'))
    .then(() => process.exit(1));

}

client.login(config.token);
