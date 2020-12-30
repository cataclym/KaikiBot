import { Command } from "@cataclym/discord-akairo";
import { Message, GuildMember } from "discord.js";
import { noArgGeneric } from "../../util/embeds";
import TicTacToe from "../../util/games/TTT";

export default class TicTacToeCommand extends Command {
	constructor() {
		super("tictactoe", {
			aliases: ["tictactoe", "ttt"],
			channel: "guild",
			description: { description: "Starts a TicTacToe game, where you play against the mentioned person.", usage: "@Dreb" },
			args: [
				{
					id: "player2",
					type: "member",
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}
	public async exec(message: Message, { player2 } : { player2: GuildMember }): Promise<TicTacToe> {
		return new TicTacToe(message.member as GuildMember, player2, message);
	}
}