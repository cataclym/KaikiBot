import { Command } from "@cataclym/discord-akairo";

export default class TicTacToeCommand extends Command {
	constructor() {
		super("tictactoe", {
			aliases: ["tictactoe", "ttt"],
			description: { description: "", usage: "" },
		});
	}
	public async exec(): Promise<void> {
		//
	}
}