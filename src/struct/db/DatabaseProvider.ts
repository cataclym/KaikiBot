import { Collection } from "discord.js";
import { Pool, RowDataPacket } from "mysql2/promise";
import { Provider, ProviderOptions } from "./Provider";

export default class DatabaseProvider extends Provider {
    private db: Pool;
    private readonly tableName: string;
    private readonly idColumn: string;
    private readonly dataColumn?: string;
    public items: Collection<string, any>;
    private readonly bigInt: boolean;

    constructor(db: Pool, tableName: string, options?: ProviderOptions, bigint?: boolean) {
        super();
        this.items = new Collection();
        this.db = db;
        this.tableName = tableName;
        this.idColumn = options?.idColumn ?? "Id";
        this.dataColumn = options?.dataColumn;
        this.bigInt = bigint ?? true;
    }

    async init(): Promise<void> {
        const [rows] = <RowDataPacket[][]> await this.db.query(
            `SELECT *
             FROM ${this.tableName}`,
        );

        for (const row of rows) {
            if (this.bigInt) {
                this.items.set(row[this.idColumn], this.dataColumn ? JSON.parse(row[this.dataColumn]) : row);
            }
            else {
                this.items.set(String(row[this.idColumn]), this.dataColumn ? JSON.parse(row[this.dataColumn]) : row);
            }
        }
    }

    get(id: string, key: string, defaultValue: any) {
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            return value == null ? defaultValue : value;
        }

        return defaultValue;
    }

    set(id: string, key: string, value: any) {
        const data = this.items.get(id) || {};
        const exists = this.items.has(id);

        data[key] = value;
        this.items.set(id, data);

        if (this.dataColumn) {
            return this.db.execute(exists
                ? `UPDATE ${this.tableName}
                   SET ${this.dataColumn} = ?
                   WHERE ${this.idColumn} = ?`
                : `INSERT INTO ${this.tableName} (${this.idColumn}, ${this.dataColumn})
                   VALUES (?, ?)`, exists
                ? [data[key], id]
                : [id, data[key]],
            );
        }

        return this.db.execute(exists
            ? `UPDATE ${this.tableName}
               SET ${key} = ?
               WHERE ${this.idColumn} = ?`
            : `INSERT INTO ${this.tableName} (${this.idColumn}, ${key})
               VALUES (?, ?)`, exists
            ? [data[key], id]
            : [id, data[key]],
        );
    }

    delete(id: string, key: string) {
        const data = this.items.get(id) || {};
        delete data[key];

        if (this.dataColumn) {
            return this.db.execute(`UPDATE ${this.tableName}
                                    SET ${this.dataColumn} = $value
                                    WHERE ${this.idColumn} = $id`, {
                $id: id,
                $value: JSON.stringify(data),
            });
        }

        return this.db.execute(`UPDATE ${this.tableName}
                                SET ${key} = $value
                                WHERE ${this.idColumn} = $id`, {
            $id: id,
            $value: null,
        });
    }

    clear(id: string) {
        this.items.delete(id);
        return this.db.execute(`DELETE
                                FROM ${this.tableName}
                                WHERE ${this.idColumn} = $id`, { $id: id });
    }
}
