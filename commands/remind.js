// const timeArray = ["1d", "2d", "3d", "4d", "5d", "6d", "7d",];
const eitherDay = ["days", "day"];
const Discord = require("discord.js");
const { prefix } = require("../config.js");

const lowEnd = Number(1);
const highEnd = Number(999);
const list = [];
for (let i = lowEnd; i <= highEnd; i++) {
	list.push(i);
}
module.exports = {
	name: "remind",
	description: "",
	args: true,
	aliases: ["rem"],
	usage: "me 69 days",
	execute(message, args) {
		const color = message.member.displayColor;
		try {

			// Variables
			var returntime;
			var timemeasure;
			console.log("Message recieved from " + message.author.id + " at " + Date.now().toString());

			// Sets the return time
			timemeasure = args[1].substring((args[1].length - 1), (args[1].length));
			returntime = args[1].substring(0, (args[1].length - 1));

			// Based off the delimiter, sets the time
			switch (timemeasure) {
				case "s":
					returntime = returntime * 1000;
					break;

				case "m":
					returntime = returntime * 1000 * 60;
					break;

				case "h":
					returntime = returntime * 1000 * 60 * 60;
					break;

				case "d":
					returntime = returntime * 1000 * 60 * 60 * 24;
					break;

				default:
					returntime = returntime * 1000;
					break;
			}

			// Returns the Message
			message.client.setTimeout(function () {
				// Removes the first array items
				args.shift();

				// Creates the message
				var content = args.join(" ");
				message.reply(content);
				console.log("Message sent to " + message.author.id + " at " + Date.now().toString());
			}, returntime);
		} catch (e) {
			message.reply("An error has occured, please make sure the command has a time delimiter and message");
			console.error(e.toString());
		}	},
};
