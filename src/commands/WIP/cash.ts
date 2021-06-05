import { Command } from "@cataclym/discord-akairo";
import { Message, User } from "discord.js";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";


export default class cash extends Command {
    private readonly _money: IMoneyService;
    constructor() {
        super("cash", {
            aliases: ["cash"],
            description: {
                description: "Shows specified user's current balance. If no user is specified, shows your balance",
                usage: "cash"
            },
            args: [
                {
                    id: "user",
                    type: "user",
                    default: (m: Message) => m.author,
                }
            ]
        });

        this._money = MongoMoney;
    }

    public async exec(msg: Message, { user }: { user: User }): Promise<void> {
        const moneh = await this._money.Get(user.id);
        await msg.channel.send(`${user.username} has ${moneh} moneh`);
    }
}
