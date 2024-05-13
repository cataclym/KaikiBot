import { Argument } from "@sapphire/framework";

export class KaikiCoinFlipArgument extends Argument<string> {
    static coinArgs: { [i: string]: string } = {
        heads: "heads",
        head: "heads",
        h: "heads",
        tails: "tails",
        tail: "tails",
        t: "tails",
    };

    public run(parameter: string): Argument.AwaitableResult<string> {
        const argument = parameter.toLowerCase();
        if (Object.keys(KaikiCoinFlipArgument.coinArgs).includes(argument)) {
            return this.ok(KaikiCoinFlipArgument.coinArgs[argument]);
        }
        return this.error({
            parameter,
            message:
                "The provided argument could not be resolved to a coin side.",
        });
    }
}
