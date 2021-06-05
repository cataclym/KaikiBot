import { moneyDB } from "../../struct/models";
import { IMoneyService } from "./IMoneyService";


export class MongoMoneyService implements IMoneyService {
    async Get(id: string): Promise<number> {
        const doc = await moneyDB.findOne({
            id: id
        });

        if (doc) {
            return doc.amount;
        }

        return 0;
    }

    async Add(id: string, amount: number): Promise<number> {
        if (amount <= 0) {
            throw new Error("Amount must be greated than 0");
        }
        // todo id must be indexed
        await moneyDB.updateOne({
            id: id
        }, {
            $inc: {
                amount: amount
            }
        }, {
            upsert: true,
            new: true
        });

        const doc = await moneyDB.findOne({ id: id });
        return doc?.amount ?? 0;
    }

    async TryTake(id: string, amount: number): Promise<boolean> {
        if (amount <= 0) {
            throw new Error("Amount must be greated than 0");
        }

        console.log(id, amount)
        const result = await moneyDB.updateOne({
            id: id,
            amount: {
                $gte: amount
            }
        }, {
            $inc: {
                amount: -amount
            }
        });

        console.log(result);
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

export const MongoMoney = new MongoMoneyService();