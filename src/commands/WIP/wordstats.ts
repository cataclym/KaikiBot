// import { Command } from "@cataclym/discord-akairo";
// import { Message, MessageAttachment, MessageEmbed } from "discord.js";
// import fetch from "node-fetch";
// import { wordCache } from "../../cache/cache";

// const gradient = ["#ffffff", "#ff9999", "#ff0000"];

// export default class WordStatisticsCommand extends Command {
// 	constructor() {
// 		super("wordstats", {
// 			aliases: ["wordstats"],
// 			description: { description: "",
// 				usage: "" },
// 		});
// 	}

// 	public async exec(message: Message): Promise<Message> {

// 		if (Object.entries(wordCache[message.channel.id]).length < 5) {
// 			return message.channel.send(new MessageEmbed()
// 				.setTitle("Too few words")
// 				.setDescription("Talk some more...")
// 				.withErrorColor(message),
// 			);
// 		}

// 		const words: string[] = await Promise.all(Object.entries(wordCache[message.channel.id])
// 			.map(async ([word, amount]) => `${word} `.repeat(amount)));

// 		console.log(words);

// 		const img = await (async () => {
// 			return await fetch("https://quickchart.io/wordcloud", {
// 				method: "POST",
// 				headers: {
// 					"Accept": "application/json",
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					"format": "png",
// 					"width": 1024,
// 					"height": 768,
// 					"text": words.join(" "),
// 					"colors": gradient,
// 				}),
// 			});
// 		})();

// 		const attachment = new MessageAttachment(await img.buffer(), "wc.jpg");

// 		return message.channel.send({ files: [attachment],
// 			embed: new MessageEmbed()
// 				.setImage("attachment://wc.jpg")
// 				.withOkColor(message),
// 		});

// 	}
// }