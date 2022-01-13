import { KaikiCommand } from "kaiki";
import fetch from "node-fetch";
import querystring from "querystring";
import { Message, MessageEmbed } from "discord.js";
import { parse } from "node-html-parser";
import { errorMessage, noArgGeneric } from "../../lib/Embeds";

type parsedResult = {
	title: string | undefined,
	url: string | undefined,
	description: string
}

export default class GoogleSearchCommand extends KaikiCommand {
    constructor() {
        super("google", {
            aliases: ["google", "search", "g"],
            description: "Search google for something .",
            usage: "bing",
            args: [{
                id: "search",
                match: "rest",
                otherwise: (m) => ({ embeds: [noArgGeneric(m)] }),
            }],
        });
    }

    private options = {
        headers: {
            "User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
        },
    };

    public async exec(message: Message, { search }: { search: string }): Promise<Message> {

        const link = `https://www.google.com/search?${querystring.stringify({ q: search })}&hl=en&gl=us`;
        const result = await fetch(link, this.options)
            .then(async reeee => parse(await reeee.text()));

        const parsedResults: parsedResult[] = [];

        for (const res of result.querySelectorAll("div.g")) {
            parsedResults.push({
                title: res.querySelector("div.yuRUbf > a > h3")?.innerText,
                url: res.querySelector("div.yuRUbf > a")?.rawAttributes.href,
                description: res.querySelector("div > div > div.IsZvec > div > span")?.innerText
					|| res.querySelector("div > div > div.IsZvec > div")?.innerText
					|| "N/A",
            });
        }

        if (!parsedResults.length) {
            return message.channel.send({ embeds: [await errorMessage(message, `**${message.author.tag}** No results found`)] });
        }

        return message.channel.send({
            embeds: parsedResults.slice(0, 5)
                .map(r => new MessageEmbed({
                    url: r.url,
                })
                    .setTitle(r.title!)
                    .setDescription(querystring.unescape(r.description))
                    .withOkColor(message)),
        });
    }
}
