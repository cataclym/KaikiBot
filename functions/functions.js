const Discord = require('discord.js');
const { prefixes, prefixes2, emotenames } = require("../variables");
const fs = require('fs');
const {client} = require('../index.js');

// handle mentions
function handleMentions(message) {
  
    if (message.mentions.has(message.client.user)) {
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
          const owner = message.guild.owner; 
          if(nickname.length <= 32 && message.author.id !== owner.id) //Will ignore guild owner
          message.member.setNickname(nickname).catch(error => {     
            if (error.code) {                                         // If any error it will log it in channel, console.
              console.error('Failed to set nick due to:', error)      // Because owner is ignored already, it wont spam error in chat
              message.channel.send(`Failed to set nick due to: ${error}`, error);
            }
          }
          )
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
  //Reacts with emote to specified words
  function emotereact(message) {
  const keywords = message.content.toLowerCase().split(" ");
  keywords.forEach(word => { 
    if(prefixes2.includes(word)) {
      const emojiname = emotenames[prefixes2.indexOf(word)];
      const emoji = message.guild.emojis.cache.find(e => e.name === emojiname);
      message.react(emoji);
    }
  })};
module.exports = { emotereact, rolecheck, handleMentions, dadbot };

