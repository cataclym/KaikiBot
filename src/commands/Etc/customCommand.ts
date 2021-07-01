// import { Command } from "discord-akairo";
// import { Message } from "discord.js";
// import db from "quick.db";
// import { codeblock } from "../../lib/Util";
// import customCommand from "../../lib/customCommand";
// const CustomCommands = new db.table("UserNickTable");
// let command: customCommand;

// export default class customCommands extends Command {
// 	constructor() {
// 		super("customcommands", {
// 			channel: "guild",
// 			editable: false,
// 			condition: (message: Message): boolean => {
// 				const customCmds = CustomCommands.get(`${message.guild?.id}`);
// 				if (customCmds) {
// 					const args = message.content.trim().split(/ +/),
// 						commandName = args.shift()?.toLowerCase();
// 					command = customCmds.get(commandName);

// 					if (!command) return false;
// 				}
// 				return false;
// 			},
// 		});
// 	}

// 	public async exec(message: Message): Promise<Message | void> {

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
