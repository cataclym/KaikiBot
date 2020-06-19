//const timeArray = ["1d", "2d", "3d", "4d", "5d", "6d", "7d",];
const eitherDay = ["days", "day"]
const Discord = require('discord.js');


const lowEnd = Number(1);
const highEnd = Number(999);
let list = [];
for (var i = lowEnd; i <= highEnd; i++) {
    list.push(i);
}
//const timeArray = new Array(list);

module.exports = {
    name: "remind",
    description: "",
    args: true,
    execute(message, args) {
        let color = message.member.displayColor 
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} 		
		else if (args[0] === 'me' && list.toString().includes(args[1]) && eitherDay.includes(args[2])) {
			return message.channel.send(`You want to be notified in ${args[1]} days time.`);
			} 
		else if (args[0] === 'me') {
            const embed = new Discord.MessageEmbed({
                "title": "Example:",
                "description": "+remind me 69 days ",
                "color": color,
                "author": {
                "name": "You need to specify the amount of time."
                }
              }
        )
            return message.channel.send(embed);
            
		}
        message.channel.send(`The following: \`${args[0]}\` will not work.\n It needs to be either \`me\` or \`here\`.`);
    },
}