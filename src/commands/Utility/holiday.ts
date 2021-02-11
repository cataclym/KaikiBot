import fetch from "node-fetch";
import { config } from "../../config";
import { Command } from "@cataclym/discord-akairo";
import { errorMessage } from "../../nsb/Embeds";
import { Message, MessageEmbed } from "discord.js";
// const otherWiseText = "Correct usage would be " + prefix + "`holiday <day> <month> (last year) (country)`\n`<day>` is numbers between `1-31`\n`<month>` is numbers between `1-12`\n`(year)` can only be previous year: `2019`." + "**Year is optional.**\n`(country)` can only be 2 letter country codes: `US`. **Country is optional.**\n**Country requires Year.**";

export default class HolidayAPICommand extends Command {
	constructor() {
		super("holiday", {
			aliases: ["holidays", "holiday"],
			description: { description: "Check today's holiday", usage: "4 6 2019 us" },
			args: [{
				id: "day",
				type: "integer",
				default: () => new Date().getDate(),
			},
			{
				id: "month",
				type: "integer",
				default: () => new Date().getMonth(),
			},
			{
				id: "year",
				type: "integer",
				default: () => new Date().getFullYear() - 1,
			},
			{
				id: "country",
				type: "string",
				default: "US",
			}],
		});
	}

	public async exec(message: Message, args: { day: number, month: number, year: number, country: string }): Promise<Message> {

		const { day, month, year, country } = args;

		if (config.holidayKey) {
			return loadTitle();
		}
		else {
			return message.channel.send(await errorMessage(message, "You need to provide a HolidayAPI token in `config.ts`\nThis only applies if you are bot owner."));
		}
		async function loadTitle() {
			return fetch(`https://holidayapi.com/v1/holidays?pretty&key=${config.holidayKey}&country=${country}&year=${year}&month=${month}&day=${day}`)
				.then((res) => res.json())
				.then((date) => PostHoliday(date));
		}
		async function PostHoliday(date: { holidays: { name: string, country: string }[] }) {
			try {
				let holidayString = `Holidays on ${day}/${month}/${year} in :flag_${date.holidays[0].country.toLowerCase()}:\n\n`;
				date.holidays.forEach(holiday => {
					holidayString += holiday.name + "\n";
				});
				return message.channel.send(new MessageEmbed({
					title: "Holiday",
					color: await message.getMemberColorAsync(),
					description: holidayString,
				}));
			}
			catch {
				return message.channel.send("No holiday on this date.");
			}
		}
	}
}