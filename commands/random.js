const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.js");

module.exports = {
	name: "random",
	description: "Sends a random number between your two inputs.",
	args: true,
	aliases: ["rndm","rng","randomnumber",],
	usage: `1 10 or ${prefix}random 25`,
	execute(message, args) {
		const color = message.member.displayColor;
		const embed = new MessageEmbed({
			title: "Result:",
			description: "number goes here", // Placeholder, will not be seen
			color,
		});
		function getRndInteger(min, max) {
			return Math.floor(Math.random() * (max - min + 1) ) + min;
		}
		if (args[1]) { // Wait do I even need this one anymore?
			if (args[1] && !args[2]) {
				const number1 = parseInt(args[0], 10); // Parse or it will spew out wrong numbers
				const number2 = parseInt(args[1], 10);
				embed.setDescription(getRndInteger(number1, number2));
				embed.setFooter(`Random number between ${args[0]} and ${args[1]}`);
				if (number1 > number2) {
					embed.setDescription(getRndInteger(number2, number1));
				}
			}	
		}
		else if (args[0] && !args[1]){
			const number1 = parseInt(args[0], 10);
			embed.setDescription(getRndInteger(1, number1));
			embed.setFooter(`Random number between 1 and ${args[0]}`);
		}
		if (embed.description.includes(NaN)) { // Easiest solution I found that worked
			embed.setTitle("Error");
			embed.setDescription("I accept only numbers and a maximum of 2 inputs.");
			embed.setFooter("Try again.");
		}
		return message.channel.send(embed);
        
	},
};