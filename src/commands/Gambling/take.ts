import { Message, MessageEmbed, User } from "discord.js";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import { KaikiCommand } from "kaiki";



export default class take extends KaikiCommand {
    private readonly _money: IMoneyService;
    constructor() {
    	super("take", {
    		ownerOnly: true,
    		aliases: ["take"],
    		description: "Takes money from the specified user",
    		usage: "50 @Cata",
    		args: [
    			{
    				id: "amount",
    				type: "integer",
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

