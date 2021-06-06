import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";

export default class award extends Command {
    private readonly _money: IMoneyService;

    constructor() {
    	super("award", {
    		ownerOnly: true,
    		aliases: ["award"],
    		description: {
    			description: "",
    			usage: "award 50 @Cata",
    		},
    		args: [
    			{
    				id: "amount",
    				type: "number",
    				otherwise: (m: Message) => new MessageEmbed({
    					title: "Invalid amount. It must be a number",
    				})
    					.withOkColor(m),
    			},
    			{
    				id: "user",
    				type: "user",
    				otherwise: (m: Message) => new MessageEmbed({
    					title: "Can't find this user. Try again.",
    				})
    					.withOkColor(m),
    			},
    		],
    	});

    	this._money = MongoMoney;
    }

    public async exec(msg: Message, { amount, user }: { amount: number; user: User; }): Promise<void> {
    	const newAmount = await this._money.Add(user.id, amount);
    	await msg.channel.send(`You've awarded ${amount} moneh to ${user.username}.\nThey now have ${newAmount} moneh`);
    }
}
