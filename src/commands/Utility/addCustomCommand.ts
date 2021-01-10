// import { Command } from "@cataclym/discord-akairo";
// import { Message } from "discord.js";
// import db from "quick.db";
// import { codeblock } from "../../nsb/Util";
// import customCommand from "../../nsb/customCommand";
// const CustomCommands = new db.table("UserNickTable");
// let command: customCommand;

// export default class customCommands extends Command {
// 	constructor() {
// 		super("customcommands", {
// 			channel: "guild",
// 			editable: false,
// 			args: [
// 				{
// 					id: "name",
// 				},
// 				{
// 					id: "color",
// 					flag: ["true"],
// 					match: "option",
// 				},
// 				{
// 					id: "images",
// 				},
// 				{
// 					id: "mention",
// 					flag: ["true"],
// 					match: "flag",
// 				},
// 				{
// 					id: "response",
// 					match: "rest",
// 				},
// 			],
// 		});
// 	}

// 	public async exec(message: Message, { name, color, images, mention, response }: { [index: string]: string }): Promise<Message | void> {

// 		command = new customCommand(this.client, { name: "", color: async (m: Message) => await m.getMemberColorAsync(), mention: true, response: "Cool %user%, %mention%" });

// 		try {
// 			command.execute(message);
// 		}
// 		catch (error) {
// 			return message.channel.send(`An error occured while executing ${command.name}:\n${await codeblock(error, "json")}`);
// 		}
// 		finally {
// 			command;
// 		}
// 	}
// }
