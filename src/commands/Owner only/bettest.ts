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
import SlotsCommand, { SlotResult, Slots } from "../Gambling/slots";

@ApplyOptions<KaikiCommandOptions>({
    name: "bettest",
    usage: ["br 100", "bf 2000", "slots 100000"],
    description: "Tests gambling commands by running them specified amounts of times.",
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

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Bettest ${BetTest.bettestNames[gambling]}`)
                    .setDescription(str)
                    .withOkColor(message),
            ],
        });
    }

    static SlotsStr(results: Array<[Slots, SlotResult, bigint]>): string {
        const collectionSize = results.length, totalSpent = BigInt(collectionSize * 100),
            winnings = BigInt(results.map((x) => x[2]).reduce((a, b) => a + b)),
            none = results.filter((x) => x[0] === Slots.x0).length,
            ten = results.filter((x) => x[0] === Slots.x10).length,
            thirty = results.filter((x) => x[0] === Slots.x30).length;

        return `x**0** - ${none} ${BetTest.calcPercentage(none, collectionSize)}
x**10** - ${ten} ${BetTest.calcPercentage(ten, collectionSize)}
x**30** - ${thirty} ${BetTest.calcPercentage(thirty, collectionSize)}

${BetTest.betStatsStr(totalSpent, winnings)}
`;
    }

    private static bettestNames: { [Property in GamblingCommands]: string } = {
        0: "Betroll",
        1: "Betflip",
        2: "Slots",
    }

    static betRollStr(results: Array<[BetRoll, number, bigint]>): string {
        // 100 is the fixed amount set in bettests
        const collectionSize = results.length, loss = results
                .map((x) => x[0])
                .filter((x) => x === BetRoll.None).length, double = results.filter((x) => x[0] === BetRoll.Double).length,
            quadruple = results.filter(
                (x) => x[0] === BetRoll.Quadruple
            ).length, ten = results.filter((x) => x[0] === BetRoll.Ten).length,
            winnings = results.map((x) => x[2]).reduce((a, b) => a + b), totalSpent = BigInt(collectionSize * 100);

        return `* x**10** - ${ten} ${BetTest.calcPercentage(ten, collectionSize)}
* x**4** - ${quadruple} ${BetTest.calcPercentage(quadruple, collectionSize)}
* x**2** - ${double} ${BetTest.calcPercentage(double, collectionSize)}
* **Loss** - ${loss} ${BetTest.calcPercentage(loss, collectionSize)}
        
${BetTest.betStatsStr(totalSpent, winnings)}
`;
    }

    static betFlipStr(results: Array<[Sides, bigint]>) {
        const collectionSize = results.length, heads = results.filter(([sides]) => sides === Sides.heads).length,
            tails = results.length - heads, winnings = results.map((x) => x[1]).reduce((a, b) => a + b),
            totalSpent = BigInt(collectionSize * 100);

        return `* Tails - ${tails} ${BetTest.calcPercentage(tails, collectionSize)}
* Heads - ${heads} ${BetTest.calcPercentage(heads, collectionSize)}

${BetTest.betStatsStr(totalSpent, winnings)}
`;
    }

    private static calcPercentage(part: number, collectionSize: number) {
        return `\`${((part / collectionSize) * 100).toFixed(2)}%\``;
    }

    private static betStatsStr(totalSpent: bigint, winnings: bigint) {
        return `Total bet: **${totalSpent}**
Payout: **${winnings}** \`${Number((winnings * 100n) / totalSpent).toFixed(2)}%\`
Difference: **${winnings - totalSpent}**`
    }
}
