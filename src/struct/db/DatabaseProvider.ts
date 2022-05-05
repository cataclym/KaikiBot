import { Provider, ProviderOptions } from "discord-akairo";
import { Collection } from "discord.js";
import { Connection, RowDataPacket } from "mysql2/promise";

export default class DatabaseProvider extends Provider {
    private _db: () => Connection;
    private readonly _tableName: string;
    private readonly _idColumn: string;
    private readonly _dataColumn?: string;
    public items: Collection<string, any>;
    private readonly _bigInt: boolean;

    constructor(db: () => Connection, tableName: string, options?: ProviderOptions, bigint?: boolean) {
        super();
        this.items = new Collection();
        this._db = db;
        this._tableName = tableName;
        this._idColumn = options?.idColumn ?? "Id";
        this._dataColumn = options?.dataColumn;
        this._bigInt = bigint ?? true;
    }

    async init(): Promise<void> {
        const [rows] = <RowDataPacket[][]> await this._db().query(
            `SELECT *
             FROM ${this._tableName}`,
        );

        for (const row of rows) {
            if (this._bigInt) {
                this.items.set(row[this._idColumn], this._dataColumn ? JSON.parse(row[this._dataColumn]) : row);
            }
            else {
                this.items.set(String(row[this._idColumn]), this._dataColumn ? JSON.parse(row[this._dataColumn]) : row);
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

        if (this._dataColumn) {
            return this._db().execute(exists
                ? `UPDATE ${this._tableName}
                   SET ${this._dataColumn} = ?
                   WHERE ${this._idColumn} = ?`
                : `INSERT INTO ${this._tableName} (${this._idColumn}, ${this._dataColumn})
                   VALUES (?, ?)`, exists
                ? [data[key], id]
                : [id, data[key]],
            );
        }

        return this._db().execute(exists
            ? `UPDATE ${this._tableName}
               SET ${key} = ?
               WHERE ${this._idColumn} = ?`
            : `INSERT INTO ${this._tableName} (${this._idColumn}, ${key})
               VALUES (?, ?)`, exists
            ? [data[key], id]
            : [id, data[key]],
        );
    }

    delete(id: string, key: string) {
        const data = this.items.get(id) || {};
        delete data[key];

        if (this._dataColumn) {
            return this._db().execute(`UPDATE ${this._tableName}
                                       SET ${this._dataColumn} = $value
                                       WHERE ${this._idColumn} = $id`, {
                $id: id,
                $value: JSON.stringify(data),
            });
        }

        return this._db().execute(`UPDATE ${this._tableName}
                                   SET ${key} = $value
                                   WHERE ${this._idColumn} = $id`, {
            $id: id,
            $value: null,
        });
    }

    clear(id: string) {
        this.items.delete(id);
        return this._db().execute(`DELETE
                                   FROM ${this._tableName}
                                   WHERE ${this._idColumn} = $id`, { $id: id });
    }
}
