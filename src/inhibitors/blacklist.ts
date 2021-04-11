// import { Inhibitor } from "@cataclym/discord-akairo";
// import { Message } from "discord.js";

// export const blacklistCache: {[id: string]: true} = {};

// export default class BlacklistInhibitor extends Inhibitor {
// 	constructor() {
// 		super("blacklist", {
// 			reason: "blacklist",
// 		});
// 	}

// 	exec(message: Message): boolean {

// 		return blacklistCache[message.author.id] ?? false;
// 	}
// }