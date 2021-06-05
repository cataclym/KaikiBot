import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
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
                    id: "maybeUser",
                    type: "user",
                    otherwise: (m: Message) => new MessageEmbed({
                        title: "Can't find this user. Try again.",
                    })
                        .withOkColor(m),
                }
            ]
        });

        this._money = MongoMoney;
    }

    public async exec(msg: Message, { maybeUser }: { maybeUser: User | undefined }): Promise<void> {
        const user = maybeUser ?? msg.author;
        const moneh = await this._money.Get(user.id);
        await msg.channel.send(`${user.username} has ${moneh} moneh`);
    }
}
