import { Command } from "discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";


export default class take extends Command {
    private readonly _money: IMoneyService;
    constructor() {
    	super("take", {
    		ownerOnly: true,
    		aliases: ["take"],
    		description: {
    			description: "Takes money from the specified user",
    			usage: "take 50 @Cata",
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
    	const success = await this._money.TryTake(user.id, amount);
    	if (!success) {
    		await msg.channel.send({
    			embeds: [new MessageEmbed()
    				.setDescription(`${user.username} has less than ${amount} ${this._money.currencySymbol}`)
    				.withErrorColor(msg)],
    		});
    		return;
    	}

    	await msg.channel.send({
    		embeds: [new MessageEmbed()
    			.setDescription(`Successfully took ${amount} ${this._money.currencySymbol} from ${user.username}`)
    			.withOkColor(msg)],
    	});
    }
}

