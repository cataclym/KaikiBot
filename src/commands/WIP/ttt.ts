import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class TicTacToeCommand extends Command {
	constructor() {
		super("tictactoe", {
			aliases: ["tictactoe", "ttt"],
			description: { description: "", usage: "" },
		});
	}
	public async exec(message: Message): Promise<void> {
		//
	}
}