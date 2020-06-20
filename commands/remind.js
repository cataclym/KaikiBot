//const timeArray = ["1d", "2d", "3d", "4d", "5d", "6d", "7d",];
const eitherDay = ["days", "day"]
const Discord = require('discord.js');
const { prefix } = require('../config.json');

const lowEnd = Number(1);
const highEnd = Number(999);
let list = [];
for (var i = lowEnd; i <= highEnd; i++) {
    list.push(i);
}
module.exports = {
    name: "remind",
    description: "",
    args: true,
    usage: "me 69 days",
    execute(message, args) {
    let color = message.member.displayColor 
// Embeds
const embed2 = new Discord.MessageEmbed({
    "title": "Success!",
    "description": `You want to be notified in ${args[1]} days time.`,
    "color": color})
const embed3 = new Discord.MessageEmbed({
    "title": "Example:",
    "description": "+remind me 69 days ",
    "color": color,
    "author": {
    "name": "You need to specify the amount of time."}})
// End		
		if (args[0] === 'me' && list.toString().includes(args[1]) && eitherDay.includes(args[2])) {
			return message.channel.send(embed2);
			} 
		else if (args[0] === 'me') {
            return message.channel.send(embed3);
		}
        message.channel.send(`The following: \`${args[0]}\` will not work.\n It needs to be either \`me\` or \`here\`.`);
    },
}