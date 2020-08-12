const Discord = require("discord.js");
const fetch = require("node-fetch");
const { holidaykey, prefix } = require("../config");

module.exports = {
	name: "holiday",
	aliases: ["holidays"],
	description: "Check today's holiday",
	args: false,
	usage: "| " + prefix + "holiday 24 12 2019",
	cmdCategory: "Utility",
	async execute(message, args) {

		const today = new Date();
		let TYear = today.getFullYear() - 1;
		let TMonth = today.getMonth() + 1;
		let TDay = today.getDate();
		let country = "US";

		if (holidaykey) {

			if (args[3]) {
				country = args[3];
			}
			if (args[2]) {
				TYear = args[2];
				TMonth = args[1];
				TDay = args[0];
			}
			else if (args[1]) {
				TMonth = args[1];
				TDay = args[0];
			}
			else if (args[0]) {
				return message.channel.send("Correct usage would be " + prefix + "`holiday <day> <month> (year) (country)`\n`<day>` is numbers between `1-31`\n`<month>` is numbers between `1-12`\n`(year)` can only be previous year: `2019`. **Year is optional.**\n`(country)` can only be 2 letter country codes: `US`. **Country is optional.**\n**Country requires Year.**");
			}
			const color = message.member.displayColor;
			loadTitle(message);
		}
		else {
			return message.channel.send("You need to provide a HolidayAPI token in `config.js`\nThis only applies if you are bot owner.");
		}
		async function loadTitle(message) {
			fetch(`https://holidayapi.com/v1/holidays?pretty&key=${holidaykey}&country=${country}&year=${TYear}&month=${TMonth}&day=${TDay}`)
				.then((res) => res.json())
				.then((date) => PostHoliday(date));
		}
		async function PostHoliday(date) {	
			try {
				message.channel.send("Today is " + date.holidays[0].name + "\n" + "Country: " + (":flag_" + date.holidays[0].country + ":").toLowerCase());
			}
			catch (error) {
				message.channel.send("No holiday on this date.").then(console.error("No holiday on this date.\n", error));
			}
		}
	},
};