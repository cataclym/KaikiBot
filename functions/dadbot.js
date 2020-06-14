module.exports = {
    name: "dadbot",
    description: "// dadbot",
    execute(message) {
    const { prefixes } = require("./variables.js");
    for (const item of prefixes) {
      const r = new RegExp("(^|\\s|$)(?<statement>(?<prefix>" + item + ")\\s*(?<nickname>.*)$)", "mi");
      if (r.test(message.content) && !message.author.bot) {
        const { nickname } = message.content.match(r).groups;
        if (nickname.length <= 256) {
          message.channel.send(`Hi, ${nickname}`);
          const owner = message.guild.owner; 
          if(nickname.length <= 32 && message.author.id !== owner.id) //Will ignore guild owner
          message.member.setNickname(nickname).catch(error => {       //
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
},
}


