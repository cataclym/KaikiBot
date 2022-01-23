import { IMoneyService } from "../../interfaces/IMoneyService";
import { PrismaClient } from "@prisma/client";

// TODO: CurrencyTransactions need to be added!
export class MoneyService implements IMoneyService {
    currencyName: string;
    currencySymbol: string;
    // private dailyProvider: MySQLProvider;
    private _orm: PrismaClient;

    constructor(connection: PrismaClient) {
        this._orm = connection;
        (async () => {
            const repo = await this._orm.botSettings.findFirst();
            this.currencyName = repo!.CurrencyName;
            this.currencySymbol = String.fromCodePoint(repo!.CurrencySymbol);
        })();
    }

    async Get(id: string): Promise<bigint> {
        const query = await this._orm.discordUsers.findFirst({ select: { Amount: true }, where: { UserId: BigInt(id) } });

        if (query) {
            return query.Amount;
        }
        this._orm.discordUsers.create({ data: { UserId: BigInt(id) } });
        return 0n;
    }

    async Add(id: string, amount: number): Promise<bigint> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }
        const query = await this._orm.discordUsers.upsert({
            where: { Id: BigInt(id) },
            update: { Amount: { increment: BigInt(amount) } },
            create: { UserId: BigInt(id) } });
        return query.Amount;
    }

    async TryTake(id: string, amount: number): Promise<boolean> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const currentAmount = await this._orm.discordUsers.findFirst({
            select: { Amount: true },
            where: { UserId: BigInt(id) },
        });

        if (currentAmount && currentAmount.Amount >= BigInt(amount)) {
            await this._orm.discordUsers.update({
                where: {
                    UserId: BigInt(id),
                },
                data: {
                    Amount: { decrement: BigInt(amount) },
                },
            });
            return true;
        }
        else if (!currentAmount) {
            await this._orm.discordUsers.create({
                data: { UserId: BigInt(id) },
            });
        }
        return false;
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
