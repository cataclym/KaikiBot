import { Argument } from "@sapphire/framework";
import KaikiArgumentsTypes from "../lib/Kaiki/KaikiArgumentsTypes";
import Constants from "../struct/Constants";

export class KaikiMoneyArgument extends Argument<bigint> {
    public async run(parameter: string, context: Argument.Context<bigint>) {

        const input = parameter.trim().toUpperCase().replace("K", "000");

        const int = KaikiArgumentsTypes.checkInt(input);

        if (!int) {
            switch (input) {
                case "ALL":
                    return this.ok(await KaikiArgumentsTypes.getCurrency(context.message));

                case "HALF":
                    return this.ok(await KaikiArgumentsTypes.getCurrency(context.message) / BigInt(2));

                case "MAX":
                    return this.ok(BigInt(Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_INT));

            }
            return this.error({
                context,
                parameter,
                identifier: "NoCorrectArgument",
                message: "Please provide a valid amount.",
            });
        }

        return context.message.client.money.Get(context.message.author.id)
            .then(money => {
                if (int <= money) {
                    return this.ok(BigInt(int));
                }
                else {
                    return this.error({
                        context,
                        parameter,
                        identifier: "NotEnoughMoney",
                        message: `You don't have enough ${this.container.client.money.currencySymbol}!`,
                    });
                }
            });
    }
}
