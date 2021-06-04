export interface ReduceResult {
    /**
     * The amount that was taken
     */
    taken: number;
    /**
     * User's updated balance after taking
     */
    balance: number;
}
