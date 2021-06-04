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
        const doc = await moneyDB.findOneAndUpdate({
            id: id
        }, {
            $inc: {
                amount: amount
            }
        }, {
            upsert: true
        });

        return doc?.amount ?? 0;
    }

    async TryTake(id: string, amount: number): Promise<boolean> {
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

        return result.ok > 0;
    }

    async Reduce(id: string, amount: number): Promise<number> {
        const result = await moneyDB.findOneAndUpdate({
            id: id,
        },
        {
            $set: {
                "$amount": {
                    $cond: {
                        if: { $lt: ["$amount", amount] },
                        then: 0,
                        else: { $inc: -amount }
                    }
                }
            }
        });

        return result?.amount ?? 0;
    }
}
