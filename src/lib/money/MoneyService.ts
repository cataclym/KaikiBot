import { PrismaClient } from "@prisma/client";

export class MoneyService {
    currencyName: string;
    currencySymbol: string;
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
        const query = await this._orm.discordUsers.findFirst({
            select: { Amount: true },
            where: { UserId: BigInt(id) },
        });

        if (query) {
            return query.Amount;
        }
        await this._orm.discordUsers.create({ data: { UserId: BigInt(id) } });
        return 0n;
    }

    async Add(id: string, amount: number, reason: string): Promise<bigint> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const bIntId = BigInt(id),
            bIntAmount = BigInt(amount);

        this.lazyCreateCurrencyTransactions(bIntId, bIntAmount, reason);
        const query = await this._orm.discordUsers.upsert({
            where: { UserId: bIntId },
            update: { Amount: { increment: bIntAmount } },
            create: { UserId: bIntId, Amount: bIntAmount },
        });
        return query.Amount;
    }

    async TryTake(id: string, amount: number, reason: string): Promise<boolean> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const bIntId = BigInt(id),
            bIntAmount = BigInt(amount);

        const currentAmount = await this._orm.discordUsers.findFirst({
            select: { Amount: true },
            where: { UserId: bIntId },
        });

        if (currentAmount && currentAmount.Amount >= bIntAmount) {
            this.lazyCreateCurrencyTransactions(bIntId, -bIntAmount, reason);
            await this._orm.discordUsers.update({
                where: {
                    UserId: bIntId,
                },
                data: {
                    Amount: { decrement: bIntAmount },
                },
            });
            return true;
        }
        else if (!currentAmount) {
            this.lazyCreateCurrencyTransactions(bIntId, bIntAmount, reason);
            await this._orm.discordUsers.create({
                data: { UserId: bIntId },
            });
        }
        return false;
    }

    lazyCreateCurrencyTransactions(id: bigint, amount: bigint, reason: string) {
        return setTimeout(async () => {
            await this._orm.currencyTransactions.create({
                data: {
                    UserId: id,
                    Amount: amount,
                    Reason: reason,
                },
            });
        }, 0);
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
