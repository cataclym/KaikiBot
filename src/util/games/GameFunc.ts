import { MessageEmbed, Message, GuildMember, User } from "discord.js";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

let gameActive = true;
let firstPlayer = true;
const gameStateP1 = new Array(9), gameStateP2 = new Array(9);

const currentPlayerTurn = `It's ${this}'s turn`;
const winningMessage = `Player ${this} has won!`;
const drawMessage = "Game ended in a draw!";

// TODO: Create embed functions that can update the array.

/**
 * Starts ttt by sending message and awaits inputs from playerOne and playerTwo
 * @param message
 * Message
 * @param playerOne
 * GuildMember
 * @param playerTwo
 * GuildMember
 * */
export default async function init(message: Message, playerOne: GuildMember, playerTwo: GuildMember): Promise<void> {

	// Create initial message, with a blank embed (Array)
	const mainMessage = await message.channel.send("Play game!", new MessageEmbed());

	do {
		getInput(firstPlayer ? playerOne : playerTwo, firstPlayer ? gameStateP1 : gameStateP2);
	} while (gameActive);

	// Meant to parse every input in loop. // Do, While loop? ^
	async function getInput(player: GuildMember, gameState: number[]) {

		const filter = async (awaitingMessage: Message, user: User) => ((new RegExp(numbers.join("|")).test(awaitingMessage.content)) && user.id === player.id);

		const collector = mainMessage.channel.createMessageCollector(filter, { max: 1, time: 25000 });

		// TODO: Create a current user method.
		// TODO: Check current user.

		const input = collector.collected.first()?.content;

		if (input) {

			// Switch between users.
			firstPlayer ? firstPlayer = false : firstPlayer = true;

			const int = parseInt(input, 10);
			gameState[int - 1] = int;

			checkGameCondition(gameState);

			if (gameState) {
				// TODO: Continue new input, next player.
			}
			// TODO: Finally update message
			mainMessage.edit;
		}
		else if (collector.ended) {
			gameActive = false;
			return mainMessage.edit(`Timed out. ${this} won the game.`);
		}
	}
	function checkGameCondition(gameState: number[]) {
		// TODO: Test combos / check if draw.
		winningCombos.forEach((a: number[]) => {
			if (gameState) return true;
			else return false;
		});
		// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaa
		return false;
	}
}