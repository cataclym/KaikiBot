import fetch from "node-fetch";
import { holidayKey } from "../../config";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
// const otherWiseText = "Correct usage would be " + prefix + "`holiday <day> <month> (last year) (country)`\n`<day>` is numbers between `1-31`\n`<month>` is numbers between `1-12`\n`(year)` can only be previous year: `2019`." + "**Year is optional.**\n`(country)` can only be 2 letter country codes: `US`. **Country is optional.**\n**Country requires Year.**";

module.exports = class HolidayAPICommand extends Command {
	constructor() {
		super("holiday", {
			aliases: ["holidays", "holiday"],
			description: "Check today's holiday",
			args: [{
				id: "day",
				type: "integer" },
			{
				id: "month",
				type: "integer" },
			{
				id: "year",
				type: "integer" },
			{
				id: "country",
				type: "string" }],
		});
	}

	async exec(message: Message, args: any) {
		const today = new Date(), TYear = args.year || today.getFullYear() - 1,
			TMonth = args.month || today.getMonth() + 1, TDay = args.month || today.getDate(),
			country = args.country || "US";

		if (holidayKey) {
			await loadTitle();
		}
		else {
			return message.channel.send("You need to provide a HolidayAPI token in `config.js`\nThis only applies if you are bot owner.");
		}
		async function loadTitle() {
			fetch(`https://holidayapi.com/v1/holidays?pretty&key=${holidayKey}&country=${country}&year=${TYear}&month=${TMonth}&day=${TDay}`)
				.then((res) => res.json())
				.then((date) => PostHoliday(date));
		}
		async function PostHoliday(date: any) {
			try {
				message.channel.send("Today is " + date.holidays[0].name + "\n" + "Country: " + (":flag_" + date.holidays[0].country + ":").toLowerCase());
			}
			catch {
				message.channel.send("No holiday on this date.");
			}
		}
	}
};