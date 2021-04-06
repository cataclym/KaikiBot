// // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Putting this on hold as google is a POS that cant even let me use my API key.

// // config.YouTubeKey
// import { Command } from "@cataclym/discord-akairo";
// import { Message } from "discord.js";
// import fetch from "node-fetch";

// const key = "";

// export default class AvatarCommand extends Command {
// 	constructor() {
// 		super("youtube", {
// 			aliases: ["youtube", "yt"],
// 			description: { description: "", usage: "" },
// 		});
// 	}
// 	public async exec(message: Message, { searchTerm }: { searchTerm: string }): Promise<Message | void> {

// 		return;

// 		try {
// 			const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${key}&type=video&part=snippet&maxResults=3&q=${searchTerm}`;

// 			fetch(searchUrl).then(async (response) => {
// 				for (const i in response) {
// 					if (Object.prototype.hasOwnProperty.call(response, i)) {
// 						// const element = response[i];
// 						// return Promise.resolve(message.util?.send(element.data.items[element]));
// 					}
// 				}
// 			});

// 		}
// 		catch {
// 			//
// 		}

// 		return message.channel.send("");
// 	}
// }