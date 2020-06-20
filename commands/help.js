const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Shows command info",
    execute(message) {
    let color = message.member.displayColor 
    const embed = new Discord.MessageEmbed({
        
            "title": "List of commands for Nadeko",
            "description": `Prefix is currently set to: "${prefix}".`,
            "color": color,
            "fields": [
              {
                "name": "Help",
                "value": "List of commands for Nadeko."
              },
              {
                "name": "Die",
                "value": "Shuts down the bot.\nRestarts if it is running under PM2."
              },
              {
                "name": "Ping",
                "value": "Ping the bot to see if there are latency issues."
              },
              {
                "name": "Dadjoke",
                "value": "Returns a dadjoke."
              },
              {
                "name": "Exclude",
                "value": "Adds or removes excluded role from user."
              }
            ],
            "footer": {
              "text": "Made by Cata <3"
            }
          }
    )
    message.channel.send(embed)
    },
}