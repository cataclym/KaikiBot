// import { Listener } from "@cataclym/discord-akairo";
// import { Message } from "discord.js";
// import { wordCache } from "../cache/cache";

// const regex = /^[a-z0-9]+$/i;

// export default class messageInvalidListener extends Listener {
// 	constructor() {
// 		super("messageInvalid", {
// 			event: "messageInvalid",
// 			emitter: "commandHandler",
// 		});
// 	}

// 	public async exec(message: Message): Promise<void> {

// 		if (!message.guild) return;

// 		if (!wordCache[message.channel.id]) {
// 			wordCache[message.channel.id] = {

// 			};
// 		}

// 		const wordArray = message.content.toLowerCase().replace(/\n/g, " ").split(/ /g);

// 		wordArray.forEach(async word => {

// 			word = word.trim();

// 			if (word.length < 2) return;

// 			// if (regex.test(word)) return;

// 			wordCache[message.channel.id][word]
// 				? wordCache[message.channel.id][word]++
// 				: wordCache[message.channel.id][word] = 1;
// 		});
// 	}
// }