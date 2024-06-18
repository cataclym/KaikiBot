import { ApplyOptions } from "@sapphire/decorators";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiArgumentsTypes, {
    GamblingCommands,
} from "../../lib/Kaiki/KaikiArgumentsTypes";
import BetRollCommand, { BetRoll } from "../Gambling/betroll";
import BetflipCommand, { Sides } from "../Gambling/betflip";
import SlotsCommand, { Slots } from "../Gambling/slots";

@ApplyOptions<KaikiCommandOptions>({
    name: "bettest",
    usage: ["br 100", "bf 2000"],
    description:
        "Tests gambling commands by running them specified amounts of times.",
    preconditions: ["OwnerOnly"],
})
export default class BetTest extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const gambling = await args.pick(
            KaikiArgumentsTypes.gamblingCommandsArgument
        );
        const executions = await args.pick("integer");

        let str: string;

        switch (gambling) {
            case GamblingCommands.br:
            case GamblingCommands.betroll:
                str = BetTest.betRollStr(
                    await Promise.all(
                        new Array(executions)
                            .fill(async () => BetRollCommand.roll())
                            .map((x) => x())
                    )
                );
                break;
            case GamblingCommands.bf:
            case GamblingCommands.betflip:
                str = BetTest.betFlipStr(
                    await Promise.all(
                        new Array(executions)
                            .fill(async () => BetflipCommand.flip())
                            .map((x) => x())
                    )
                );
                break;
            case GamblingCommands.slot:
            case GamblingCommands.slots:
                str = BetTest.SlotsStr(
                    await Promise.all(
                        new Array(executions)
                            .fill(async () => SlotsCommand.run())
                            .map((x) => x())
                    )
                );
                break;
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Betting Test")
                    .setDescription(str)
                    .withOkColor(message),
            ],
        });
    }

    static SlotsStr(results: Array<[Slots, bigint]>): string {
        const collectionSize = results.length;

        const totalSpent = BigInt(collectionSize * 100);
        const winnings = results.map((x) => x[1]).reduce((a, b) => a + b);

        const none = results.filter((x) => x[0] === Slots.x0).length,
            ten = results.filter((x) => x[0] === Slots.x10).length,
            thirty = results.filter((x) => x[0] === Slots.x30).length;

        return `x0 - ${none} ${BetTest.calcPercentage(none, collectionSize)}
x10 - ${ten} ${BetTest.calcPercentage(ten, collectionSize)}
x30 - ${thirty} ${BetTest.calcPercentage(thirty, collectionSize)}

Total bet: **${totalSpent}**
Payout: **${winnings - totalSpent}** \`${Number((winnings * 100n) / totalSpent).toFixed(2)}%\`
`;
    }

    static betRollStr(results: Array<[BetRoll, number, bigint]>): string {
        const collectionSize = results.length;

        const loss = results
                .map((x) => x[0])
                .filter((x) => x === BetRoll.None).length,
            double = results.filter((x) => x[0] === BetRoll.Double).length,
            quadruple = results.filter(
                (x) => x[0] === BetRoll.Quadruple
            ).length,
            ten = results.filter((x) => x[0] === BetRoll.Ten).length;

        const winnings = results.map((x) => x[2]).reduce((a, b) => a + b);
        // 100 is the fixed amount set in bettests
        const totalSpent = BigInt(collectionSize * 100);

        return `* x**10** - ${ten} ${BetTest.calcPercentage(ten, collectionSize)}
* x**4** - ${quadruple} ${BetTest.calcPercentage(quadruple, collectionSize)}
* x**2** - ${double} ${BetTest.calcPercentage(double, collectionSize)}
* **Loss** - ${loss} ${BetTest.calcPercentage(loss, collectionSize)}
        
Total bet: **${totalSpent}**
Payout: **${winnings - totalSpent}** \`${Number((winnings * 100n) / totalSpent).toFixed(2)}%\`
`;
    }

    static betFlipStr(results: Array<[Sides, bigint]>) {
        const collectionSize = results.length;
        const heads = results.filter(([sides]) => sides === Sides.heads).length;
        const tails = results.length - heads;

        return `* Tails - ${tails} ${BetTest.calcPercentage(tails, collectionSize)}
* Heads - ${heads} ${BetTest.calcPercentage(heads, collectionSize)}

Total bet: **${collectionSize * 100}**
Payout: **${results.map((x) => x[1]).reduce((a, b) => a + b)}**
`;
    }

    private static calcPercentage(part: number, collectionSize: number) {
        return `\`${((part / collectionSize) * 100).toFixed(2)}%\``;
    }
}
