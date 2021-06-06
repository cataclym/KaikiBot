import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";

const slotDict: {[num: number]: string} = {
	1: "🍏",
	2: "🍎",
	3: "🍐",
	4: "🍊",
	5: "🍋",
	6: "🍌",
	7: "🍉",
	8: "🍇",
	9: "🫐",
	10: "🍓",
	11: "🍈",
	12: "🍒",
	13: "🍑",
	14: "🥭",
	15: "🍍",
	16: "🥥",
	17: "🥝",
	18: "🍅",
	19: "🍆",
	20: "🥑",

};

export default class slotsCommand extends Command {

    private readonly _money: IMoneyService;
    constructor() {
    	super("Slots", {
    		aliases: ["slots", "slot"],
    		description: { description: "Bet a certan amount in the slot machine.",
    			usage: "<amount>" },
    		args: [
    			{
    				id: "amount",
    				type: "number",
    				otherwise: (m: Message) => new MessageEmbed()
    					.setTitle("Invalid amount. It must be a number")
    					.withOkColor(m),
    			},
    		],
    	});
    	this._money = MongoMoney;
    }

    public async exec(message: Message, { amount }: { amount: number }): Promise<void> {

    	if (amount < 2) {
    		message.channel.send("You need to bet more than 2 moneh");
    		return;
    	}

    	const success = await this._money.TryTake(message.author.id, amount);

    	if (!success) {
    		await message.channel.send(`You have less than ${amount} moneh`);
    		return;
    	}

    	const randomEmoji = () => slotDict[Math.floor(Math.random() * 19) + 1];

    	const slots = async () => {

    		const index1 = randomEmoji();
    		const index2 = randomEmoji();
    		const index3 = randomEmoji();
    		const index4 = randomEmoji();
    		const index5 = randomEmoji();
    		const index6 = randomEmoji();
    		const index7 = randomEmoji();
    		const index8 = randomEmoji();
    		const index9 = randomEmoji();

    		return { string: `[ Kaiki Slots ]
${index1} - ${index2} - ${index3}
${index4} - ${index5} - ${index6}
${index7} - ${index8} - ${index9}
| - - - 💵 - - - |`,

    		numbers: [index4, index5, index6] };

    	};

    	const result = await slots();

    	if (result.numbers.every((val, i, arr) => val === arr[0])) {
    		const winAmount = amount * 30;
    		this._money.Add(message.author.id, winAmount);
    		result.string += `\n\nYou won ${winAmount}!`;

    	}

    	else if (result.numbers[0] === result.numbers[1]
            || result.numbers[0] === result.numbers[2]
            || result.numbers[1] === result.numbers[0]
            || result.numbers[1] === result.numbers[2]
            || result.numbers[2] === result.numbers[0]
            || result.numbers[2] === result.numbers[1]) {

    		const winAmount = amount * 10;
    		this._money.Add(message.author.id, winAmount);
    		result.string += `\n\nYou won ${winAmount}!`;
    	}

    	else {
    		result.string += "\n\nYou won nothing ^_^";
    	}


    	await message.channel.send((await slots()).string)
    		.then(async m => {
    			setTimeout(async () => m.edit((await slots()).string), 1000);
    			setTimeout(async () => m.edit(result.string), 2100);
    		});
    }
}