import { Snowflake } from "discord.js";

export interface ReduceResult {
    /**
     * The amount that was taken
     */
    taken: number,
    /**
     * User's updated balance after taking
     */
    balance: number
}

export interface MoneyService {
    /**
     * Gets specified user's current balance
     * @param id Id of the user
     * @returns Current balance
     */
    Get(id: Snowflake): Promise<number>;

    /**
     * Add money to the specified user
     * @param id Id of the user
     * @returns User's updated balance
     */
    Add(id: Snowflake): Promise<number>;

    /**
     * Try to reduce user's balance by the given amount
     * @param id Id of the user
     * @param amount Amount to try and take
     * @returns Whether the amount is successfully deduced from the user's balance
     */
    TryTake(id: Snowflake, amount: number): Promise<boolean>;

    /**
     * Forcefully reduce the specified amount from user's balance
     * If the user user's balance is insufficient, it will take as much as it can
     * and leave user's balance at 0
     * @param id Id of the user
     * @returns Information about the action
     */
    Reduce(id: Snowflake): Promise<ReduceResult>;
}

export class MongoMoneyService implements MoneyService {
    Get(id: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    Add(id: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    TryTake(id: string, amount: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    Reduce(id: string): Promise<ReduceResult> {
        throw new Error("Method not implemented.");
    }
}