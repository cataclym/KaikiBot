import { PrismaClient } from "@prisma/client";

export class MoneyService {
    currencyName: string;
    currencySymbol: string;
    private _orm: PrismaClient;

    constructor(connection: PrismaClient) {
        this._orm = connection;
        (async () => {
            const repo = await this._orm.botSettings.findFirst();
            if (!repo) throw new Error("Missing row in BotSettings table!");
            this.currencyName = repo.CurrencyName;
            this.currencySymbol = String.fromCodePoint(repo.CurrencySymbol);
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

    async Add(id: string, amount: bigint, reason: string): Promise<bigint> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const bIntId = BigInt(id);

        this.lazyCreateCurrencyTransactions(bIntId, amount, reason);

        const query = await this._orm.discordUsers.upsert({
            where: { UserId: bIntId },
            update: { Amount: { increment: amount } },
            create: { UserId: bIntId, Amount: amount },
        });
        return query.Amount;
    }

    async TryTake(id: string, amount: bigint, reason: string): Promise<boolean> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const bIntId = BigInt(id);
        const currentAmount = await this._orm.discordUsers.findFirst({
            select: { Amount: true },
            where: { UserId: bIntId },
        });

        if (currentAmount && currentAmount.Amount >= amount) {
            this.lazyCreateCurrencyTransactions(bIntId, -amount, reason);
            await this._orm.discordUsers.update({
                where: {
                    UserId: bIntId,
                },
                data: {
                    Amount: { decrement: amount },
                },
            });
            return true;
        }
        else if (!currentAmount) {
            this.lazyCreateCurrencyTransactions(bIntId, amount, reason);
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
}
