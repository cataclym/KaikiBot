import { Message, MessageEmbed, User } from "discord.js";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import { KaikiCommand } from "kaiki";



export default class cash extends KaikiCommand {
    private readonly _money: IMoneyService;
    constructor() {
    	super("cash", {
    		aliases: ["cash", "currency", "cur", "$", "¥", "£", "€"],
    		description: "Shows specified user's current balance. If no user is specified, shows your balance",
    		usage: "",
    		args: [
    			{
    				id: "user",
    				type: "user",
    				default: (m: Message) => m.author,
    			},
    		],
    	});

    	this._money = MongoMoney;
    }

    public async exec(msg: Message, { user }: { user: User }): Promise<void> {
    	const moneh = await this._money.Get(user.id);
    	await msg.channel.send({ embeds: [new MessageEmbed()
    		.setDescription(`${user.username} has ${moneh} ${this._money.currencyName} ${this._money.currencySymbol}`)
    		.withOkColor(msg)],
    	});
    }
}
