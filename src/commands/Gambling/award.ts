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
    					.withErrorColor(m),
    			},
    			{
    				id: "user",
    				type: "user",
    				otherwise: (m: Message) => new MessageEmbed({
    					title: "Can't find this user. Try again.",
    				})
    					.withErrorColor(m),
    			},
    		],
    	});

    	this._money = MongoMoney;
    }

    public async exec(msg: Message, { amount, user }: { amount: number; user: User; }): Promise<void> {
    	const newAmount = await this._money.Add(user.id, amount);
    	await msg.channel.send({
    		embeds: [new MessageEmbed()
    			.setDescription(`You've awarded ${amount} ${this._money.currencyName} ${this._money.currencySymbol} to ${user.username}.\nThey now have ${newAmount} ${this._money.currencyName}`)
    			.withOkColor(msg)],
    	});
    }
}
