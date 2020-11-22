import fetch from "node-fetch";
import { config } from "../../config";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { errorMessage } from "../../functions/embeds";
// const otherWiseText = "Correct usage would be " + prefix + "`holiday <day> <month> (last year) (country)`\n`<day>` is numbers between `1-31`\n`<month>` is numbers between `1-12`\n`(year)` can only be previous year: `2019`." + "**Year is optional.**\n`(country)` can only be 2 letter country codes: `US`. **Country is optional.**\n**Country requires Year.**";

export default class HolidayAPICommand extends Command {
	constructor() {
		super("holiday", {
			aliases: ["holidays", "holiday"],
			description: { description: "Check today's holiday", usage: "4 6" },
			args: [{
				id: "day",
				type: "integer",
				default: async () => new Date().getDay(),
			},
			{
				id: "month",
				type: "integer",
				default: async () => new Date().getMonth() - 1,
			},
			{
				id: "year",
				type: "integer",
				default: async () => new Date().getFullYear() - 1,
			},
			{
				id: "country",
				type: "string",
				default: "US",
			}],
		});
	}

	public async exec(message: Message, args: any): Promise<Message> {
		const TYear = args.year,
			TMonth = args.month,
			TDay = args.month,
			country = args.country;

		if (config.holidayKey) {
			return loadTitle();
		}
		else {
			return message.channel.send(await errorMessage("You need to provide a HolidayAPI token in `config.ts`\nThis only applies if you are bot owner."));
		}
		async function loadTitle() {
			return fetch(`https://holidayapi.com/v1/holidays?pretty&key=${config.holidayKey}&country=${country}&year=${TYear}&month=${TMonth}&day=${TDay}`)
				.then((res) => res.json())
				.then((date) => PostHoliday(date));
		}
		async function PostHoliday(date: any) {
			try {
				return message.channel.send("Today is " + date.holidays[0].name + "\n" + "Country: " + (":flag_" + date.holidays[0].country + ":").toLowerCase());
			}
			catch {
				return message.channel.send("No holiday on this date.");
			}
		}
	}
}