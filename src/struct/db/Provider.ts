import { Collection } from "discord.js";

export class Provider {
    public items: Collection<string, any>;

    constructor() {
        /**
         * Cached entries.
         * @type {Collection<string, Object>}
         */
        this.items = new Collection();
    }

    /**
     * Initializes the provider.
     * @abstract
     * @returns {any}
     */
    init(): any {
        throw new Error("NOT_IMPLEMENTED");
    }

    /**
     * Gets a value.
     * @abstract
     * @param {string} id - ID of entry.
     * @param {string} key - The key to get.
     * @param {any} [defaultValue] - Default value if not found or null.
     * @returns {any}
     */
    get(id: string, key: string, defaultValue?: any): any {
        throw new Error("NOT_IMPLEMENTED");
    }

    /**
     * Sets a value.
     * @abstract
     * @param {string} id - ID of entry.
     * @param {string} key - The key to set.
     * @param {any} value - The value.
     * @returns {any}
     */
    set(id: string, key: string, value: any): any {
        throw new Error("NOT_IMPLEMENTED");
    }

    /**
     * Deletes a value.
     * @abstract
     * @param {string} id - ID of entry.
     * @param {string} key - The key to delete.
     * @returns {any}
     */
    delete(id: string, key: string): any {
        throw new Error("NOT_IMPLEMENTED");
    }

    /**
     * Clears an entry.
     * @abstract
     * @param {string} id - ID of entry.
     * @returns {any}
     */
    clear(id: string): any {
        throw new Error("NOT_IMPLEMENTED");
    }
}

/**
 * Options to use for providers.
 */
export type ProviderOptions = {
    idColumn: string | "Id";
    dataColumn?: string;
}
