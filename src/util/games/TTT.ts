import { MessageEmbed, Message, GuildMember } from "discord.js";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const drawMessage = "Game ended in a draw!";

export default class TicTacToe {
	p1: GuildMember;
	p2: GuildMember;
	message: Message;
	embed: Promise<Message>;
	currentPlayerTurn: (p: GuildMember) => Promise<Message>;
	winningMessage: (p: GuildMember) => string;
	timedWinMessage: (p: GuildMember) => string;
	stateDict: {[index: number]: string};
	/**
	 * Initializes a TicTacToe game.
	 * @param p1 @type {GuildMember}
	 * @param p2 @type {GuildMember}
	 * @param message @type {Message}
	 */
	constructor(p1: GuildMember, p2: GuildMember, message: Message) {
		this.p1 = p1;
		this.p2 = p2;
		this.message = message;
		this.stateDict = {
			0: "1⃣", 1: "2⃣", 2: "3⃣",
			3: "4⃣", 4: "5⃣", 5: "6⃣",
			6: "7⃣", 7: "8⃣", 8: "9⃣",
		};

		this.start();

		this.embed = this.message.channel.send(`${this.p2} starts!`, new MessageEmbed({
			description: JSON.stringify(this.stateDict, null, 4),
		}));

		this.currentPlayerTurn = (p: GuildMember) => this.message.channel.send(`It's ${p}'s turn`).then(m => m.delete({ timeout: 2500 }));
		this.winningMessage = (p: GuildMember) => `Player <@${p.id}> has won!`;
		this.timedWinMessage = (p: GuildMember) => `Player <@${p.id}> didn't make a move for 20 seconds, making <@${p.id === this.p1.id ? this.p1.id : this.p2.id}>`;

	}
	private start() {
		this.awaitInput(this.p2);
	}
	private async awaitInput(player: GuildMember, updateEmbed?: boolean): Promise<number | void> {

		if (updateEmbed) {
			(await this.embed).edit(null, new MessageEmbed({
				description: Object.values.replace("p1", "🟩").replace("p2", "🟦"),
			}));
		}

		const filter = (m: Message) => numbers.includes(m.content) && m.member?.id === player.id;
		const collector = this.message.channel.createMessageCollector(filter, { time: 20000 });

		collector.once("collect", (m: Message) => {
			return this.input(player, parseInt(m.content) - 1);
		});

		collector.on("end", () => {
			return this.timedWin(player);
		});
	}

	private async input(player: GuildMember, input: number) {
		const playerSignature = player.id === this.p1.id ? "p1" : "p2";
		this.stateDict[input] = playerSignature;
		if (this.checkWinningCombination(playerSignature)) {
			return this.win(player);
		}
		else if (this.checkTie()) {
			return this.tie();
		}
		const currentPlayer = player.id === this.p1.id ? this.p1 : this.p2;
		this.currentPlayerTurn(currentPlayer);
		return this.awaitInput(currentPlayer, true);
	}

	private checkWinningCombination(str: string) {
		return winningCombos.some(arr => {
			if (arr.every(num => this.stateDict[num] === str)) {
				return true;
			}
			return false;
		});
	}

	private checkTie() {
		return winningCombos.some(arr => {
			if (arr.every(num => this.stateDict[num] === ("p1" || "p2"))) {
				return true;
			}
			return false;
		});
	}

	private win(winner: GuildMember) {
		this.message.channel.send(this.winningMessage(winner));
		return this.message.delete();
	}

	private timedWin(loser: GuildMember) {
		this.timedWinMessage(loser);
		return this.message.delete();
	}

	private tie() {
		this.message.channel.send(drawMessage);
		return this.message.delete();
	}
}