import { Argument } from "@sapphire/framework";

export class KaikiCoinFlipArgument extends Argument<string> {

    static coinArgs: { [i: string]: string } = {
        "heads": "heads",
        "head": "heads",
        "h": "heads",
        "tails": "tails",
        "tail": "tails",
        "t": "tails",
    };

    public run(parameter: string): Argument.AwaitableResult<string> {

        if (Object.keys(KaikiCoinFlipArgument.coinArgs).includes(parameter)) {
            return this.ok(KaikiCoinFlipArgument.coinArgs[parameter]);
        }
        return this.error({ parameter, message: "The provided argument could not be resolved to a coin side." });
    }
}
