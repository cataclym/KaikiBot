import { KaikiClient } from "../../struct/client";
import { moneyModel } from "../../struct/db/models";
import { IMoneyService } from "./IMoneyService";
import { getBotDocument } from "../../struct/documentMethods";

export class MongoMoneyService implements IMoneyService {
    currencyName: string;
    currencySymbol: string;

    constructor() {
    	(async () => {
    		const doc = await getBotDocument();
    		this.currencyName = doc.settings.currencyName;
    		this.currencySymbol = doc.settings.currencySymbol;
    	})();
    }

    async Get(id: string): Promise<number> {
    	const doc = await moneyModel.findOne({
    		id: id,
    	});

    	if (doc) {
    		return doc.amount;
    	}

    	return 0;
    }

    async Add(id: string, amount: number): Promise<number> {
    	if (amount <= 0) {
    		throw new Error("Amount must be greater than 0");
    	}
    	// todo id must be indexed
    	await moneyModel.updateOne({
    		id: id,
    	}, {
    		$inc: {
    			amount: amount,
    		},
    	}, {
    		upsert: true,
    		new: true,
    	});

    	const doc = await moneyModel.findOne({ id: id });
    	return doc?.amount ?? 0;
    }

    async TryTake(id: string, amount: number): Promise<boolean> {
    	if (amount <= 0) {
    		throw new Error("Amount must be greater than 0");
    	}

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

    async UpdateCurrencyNameAndSymbol(client: KaikiClient): Promise<void> {
    	this.currencyName = client.botSettings.get(client.botSettingID, "currencyName", "Yen");
    	this.currencySymbol = client.botSettings.get(client.botSettingID, "currencySymbol", "💴");
    }
}

export const MongoMoney = new MongoMoneyService();
