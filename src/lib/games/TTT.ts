// import { MessageEmbed, Message, GuildMember } from "discord.js";

// const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
// const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

// const drawMessage = "Game ended in a draw!";
// type playerType = { player: GuildMember, color: string, sign: string };

// export default class TicTacToe {
// 	p1: playerType;
// 	p2: playerType;
// 	currentPlayer: playerType;
// 	message: Message;
// 	embed: Promise<Message>;
// 	moves?: playerType[];
// 	currentPlayerTurn: (p: GuildMember, m: Message) => Promise<Message>;
// 	winningMessage: (p: GuildMember) => string;
// 	timedWinMessage: (p: GuildMember) => string;
// 	stateDict: {[index: number]: string};
// 	active: boolean;

// 	/**
// 	 * Initializes a TicTacToe game.
// 	 * @param player1 @type {GuildMember}
// 	 * @param player2 @type {GuildMember}
// 	 * @param message @type {Message}
// 	 */

// 	constructor(player1: GuildMember, player2: GuildMember, message: Message) {
// 		this.p1 = { player: player1, color: "#78b159", sign: "p1" };
// 		this.p2 = { player: player2, color: "#dd2e44", sign: "p2" };
// 		this.currentPlayer = this.p2;
// 		this.message = message;
// 		this.stateDict = {
// 			0: "1️⃣", 1: "2️⃣", 2: "3️⃣",
// 			3: "4️⃣", 4: "5️⃣", 5: "6️⃣",
// 			6: "7️⃣", 7: "8️⃣", 8: "9️⃣",
// 		};
// 		this.active = true;

// 		this.start();

// 		this.embed = this.message.channel.send(`${this.p2.player} starts!`, new MessageEmbed({
// 			description: Object.values(this.stateDict).map((v, i) => [2, 5].includes(i) ? v + "\n" : v).join(""),
// 			color: this.p2.color,
// 		}));

// 		this.currentPlayerTurn = async (p: GuildMember, m: Message) => this.message.channel.send(`It's ${p}'s turn`).then(async (m2) => {
// 			m?.delete({ timeout: 3500 });
// 			return m2.delete({ timeout: 4500 });
// 		});
// 		this.winningMessage = (p: GuildMember) => `Player ${p} has won!`;
// 		this.timedWinMessage = (p: GuildMember) => `Player ${p} didn't make a move for 20 seconds, making <@${p.id !== this.p1.player.id ? this.p1.player.id : this.p2.player.id}> the winner.`;
// 	}

// 	private start() {
// 		this.awaitInput(this.p2);
// 	}

// 	private async awaitInput(playerObject: playerType): Promise<number | void | Message> {

// 		if (!this.active) return;

// 		console.log("active, awaiting: ", playerObject.player.user.username);

// 		const { player } = playerObject;

// 		const filter = (m: Message) => numbers.includes(m.content) && m.member?.id === player.id;

// 		this.message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
// 			.then(collected => {
// 				return this.input(playerObject, collected.first() as Message);
// 			})
// 			.catch(() => {
// 				return this.timedWin(playerObject);
// 			});
// 	}

// 	private async input(playerObject: playerType, m: Message) {

// 		const { player, sign } = playerObject;

// 		if (!numbers.includes(m.content.trim())) {
// 			m.delete();
// 			return this.awaitInput(playerObject);
// 		}

// 		const int = parseInt(m.content) - 1;

// 		if (this.stateDict[int] === ("p1" || "p2")) {
// 			m.delete();
// 			return this.awaitInput(playerObject);
// 		}

// 		this.stateDict[int] = sign;
// 		this.currentPlayer = player.id !== this.p1.player.id ? this.p1 : this.p2;

// 		this.updateEmbed(this.currentPlayer);
// 		this.currentPlayerTurn(this.currentPlayer.player, m);

// 		if (this.checkWin(sign)) {
// 			return this.win(playerObject);
// 		}

// 		else if (this.checkTie("p1" || "p2")) {
// 			return this.tie();
// 		}

// 		return this.awaitInput(this.currentPlayer);
// 	}

// 	private async updateEmbed(playerObject: playerType): Promise<Message | NodeJS.Timeout> {

// 		const finalString = `It's ${playerObject.player}'s turn to make a move.`;
// 		const finalEmbed = new MessageEmbed({
// 			description: Object.values(this.stateDict).map((v, i) => [2, 5].includes(i) ? v + "\n" : v).join("").replace(/p1/g, "🟩").replace(/p2/g, "🟥"),
// 			color: playerObject.color,
// 		});
// 		return (await this.embed).edit(finalString, finalEmbed);
// 	}

// 	private checkWin(value: string) {
// 		return winningCombos.some(arr => {
// 			if (arr.every(num => this.stateDict[num] === value)) {
// 				return true;
// 			}
// 			return false;
// 		});
// 	}

// 	private checkTie(value: string) {
// 		return Object.values(this.stateDict).every(str => {
// 			if (str === value) {
// 				return true;
// 			}
// 			return false;
// 		});
// 	}

// 	private win(winner: playerType) {
// 		if (this.active) {
// 			this.active = false;
// 			return this.message.channel.send(this.winningMessage(winner.player));
// 		}
// 	}

// 	private timedWin(loser: playerType) {
// 		if (this.active) {
// 			this.active = false;
// 			return this.message.channel.send(this.timedWinMessage(loser.player));
// 		}
// 	}

// 	private tie() {
// 		if (this.active) {
// 			this.active = false;
// 			return this.message.channel.send(drawMessage);
// 		}
// 	}
// }