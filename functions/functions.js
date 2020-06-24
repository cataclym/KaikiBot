const Discord = require('discord.js');
const { prefixes, prefixes2, emotenames } = require("../variables");
const {client} = require('../index.js');
const { prefix } = require('../config.json');
const db = require('quick.db');
const UserNickTable = new db.table('UserNickTable')

// handle mentions
function handleMentions(message) {
  let color = message.member.displayColor 
  const embed = new Discord.MessageEmbed({
    "title": `Hi ${message.author.username}, what is up?`,
    "description": `If you need help type ${prefix}help.`,
    "color": color
  })
    if (message.mentions.has(message.client.user) && !message.author.bot) {
      message.channel.startTyping()
        .then(message.channel.send(embed))
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
  const owner = message.guild.owner; 
  if(nickname.length <= 32) {   
    const guildmemb = message.author;  
    UserNickTable.push(`usernicknames.${guildmemb.id}`, nickname)
     //const FetchDBNames = UserNickTable.fetch(`usernicknames.${message.member}`);
     //console.log(FetchDBNames); //For debug
    if(message.author.id !== owner.id) {                      //Ignore guild owner as their nicknames cannot be changed          
    message.member.setNickname(nickname).catch(error => {     
    if (error.code) {                                         // If any error it will log it in channel, console.
      console.error('Failed to set nick due to:', error)      
      message.channel.send(`Failed to set nick due to: ${error}`, error);
    }})}}}
break;
  }
 }
};
// check for special role
function rolecheck(message) {
  const specialString = require("../storage/names.json");
  if (message.member.roles.cache.find(r => r.name === specialString.name)) {
    //console.log("Role checked:", specialString.name); //For debug.
    return true;
  }
  return false;
}
//Reacts with emote to specified words
function emotereact(message) {
const keywords = message.content.toLowerCase().split(" ");
keywords.forEach(word => { 
  if(prefixes2.includes(word)) {
    const emojiname = emotenames[prefixes2.indexOf(word)];
    if (!message.guild.emojis.cache.find(e => e.name === emojiname)) return console.log("Couldnt react to message. Emote probably doesnt exist on this guild.");
    const emojiArray = message.guild.emojis.cache.find(e => e.name === emojiname);
    message.react(emojiArray)
}
}
  )};
module.exports = { emotereact, rolecheck, handleMentions, dadbot, UserNickTable };
