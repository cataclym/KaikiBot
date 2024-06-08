import { ApplyOptions } from "@sapphire/decorators";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiArgumentsTypes, { GamblingCommands } from "../../lib/Kaiki/KaikiArgumentsTypes";
import BetRollCommand, { BetRoll } from "../Gambling/betroll";
import BetflipCommand, { Sides } from "../Gambling/betflip";
import SlotsCommand, { Slots } from "../Gambling/slots";

@ApplyOptions<KaikiCommandOptions>({
    name: "bettest",
    usage: ["br 100", "bf 2000"],
    description: "Tests gambling commands by running them specified amounts of times.",
    preconditions: ["OwnerOnly"],
})
export default class BetTest extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const gambling = await args.pick(KaikiArgumentsTypes.gamblingCommandsArgument);
        const executions = await args.pick("integer");

        let str: string;

        switch (gambling) {
            case GamblingCommands.br:
            case GamblingCommands.betroll:
                str = BetTest.betRollStr(await Promise.all(new Array(executions).fill(async () => BetRollCommand.roll()).map(x => x())))
                break;
            case GamblingCommands.bf:
            case GamblingCommands.betflip:
                str = BetTest.betFlipStr(await Promise.all(new Array(executions).fill(async () => BetflipCommand.flip()).map(x => x())))
                break;
            case GamblingCommands.slot:
            case GamblingCommands.slots:
                str = BetTest.SlotsStr(await Promise.all(new Array(executions).fill(async () => SlotsCommand.run()).map(x => x())))
                break;
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Betting Test")
                    .setDescription(str)
                    .withOkColor(message)
            ]
        })
    }

    static SlotsStr(arg0: any[]): string {
        throw new Error("Method not implemented.");
    }

    static betRollStr(results: Array<[BetRoll, number, bigint]>): string {

        const loss = results.map(x => x[0]).filter(x => x === BetRoll.None).length, double = results.filter(x => x[0] === BetRoll.Double).length, quadruple = results.filter(x => x[0] === BetRoll.Quadruple).length, ten = results.filter(x => x[0] === BetRoll.Ten).length;

        const winnings = results.map(x => x[2]).reduce((a, b) => BigInt(a) + b);
        // 100 is the fixed amount set in bettests
        const totalSpent = BigInt(results.length * 100);

        return `* x**10** - ${ten} \`${((ten / results.length) * 100).toFixed(2)}%\`
* x**4** - ${quadruple} \`${((quadruple / results.length) * 100).toFixed(2)}%\`
* x**2** - ${double} \`${((double / results.length) * 100).toFixed(2)}%\`
* **Loss** - ${loss} \`${((loss / results.length) * 100).toFixed(2)}%\`
        
Total bet: **${totalSpent}**
Payout: **${winnings - totalSpent}** \`${Number(winnings * 100n / totalSpent).toFixed(2)}%\`
`
    }

    static betFlipStr(p: Awaited<unknown>[]) {
        return ``;
    }
}
