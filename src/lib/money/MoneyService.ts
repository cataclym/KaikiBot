import { Connection } from "mongoose";
import { moneyModel } from "../../struct/db/models";
import MySQLProvider from "../../struct/db/MySQLProvider";
import { BotSettings } from "../../struct/entities/BotSettings";
import { DiscordUsers } from "../../struct/entities/DiscordUsers";
import { IMoneyService } from "./IMoneyService";

export class MoneyService implements IMoneyService {
    currencyName: string;
    currencySymbol: string;
    private dailyProvider: MySQLProvider;

    constructor(connection: Connection) {
        (async () => {
            const repo = await this._orm.em.findOne(BotSettings, { Id: "1" });
            this.currencyName = repo!.CurrencyName;
            this.currencySymbol = String.fromCodePoint(repo!.CurrencySymbol);
        })();
    }

    async Get(id: string): Promise<bigint> {
        const user = await this._orm.em.findOne(DiscordUsers, {
            UserId: BigInt(id),
        });

        if (user) {
            return user.Amount;
        }
        this._orm.em.create(DiscordUsers, { UserId: BigInt(id) });
        return 0n;
    }

    async Add(id: string, amount: number): Promise<bigint> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }
        const query = await this._orm.em.execute<DiscordUsers>("UPDATE DiscordUsers SET Amount = Amount + ? WHERE UserId = ?", [amount, id]);

        return query.Amount;
    }

    async TryTake(id: string, amount: number): Promise<boolean> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const query = await this._orm.em.execute<DiscordUsers>("UPDATE DiscordUsers Set Amount = Amount - ? WHERE UserId = ? AND Amount >= ?", [amount, id, amount]);
        // const qb = this._orm.em.createQueryBuilder(DiscordUsers);
        // const query = await qb
        //     .where({ UserId: Number(id) })
        //     .andWhere(await qb.raw("Amount >= ?", [amount]))
        //     .execute("all");
        return !!query;

        const result = await moneyModel.updateOne({
            id: id,
            amount: {
                $gte: amount,
            },
        }, {
            $inc: {
                amount: -amount,
            },
        });

        return result.nModified > 0;
    }

    // async Reduce(id: string, amount: number): Promise<bool> {
    //     // todo amount must be > 0
    //     await moneyDB.updateOne({
    //         id: id
    //     },
    //     {
    //         $set: {
    //             "$amount": {
    //                 $cond: {
    //                     if: { $lt: ["$amount", amount] },
    //                     then: 0,
    //                     else: { $inc: -amount }
    //                 }
    //             }
    //         }
    //     });

    //     return 0;
    // }

}
