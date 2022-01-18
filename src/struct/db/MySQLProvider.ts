import { Provider, ProviderOptions } from "discord-akairo";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Collection } from "discord.js";

class MySQLProvider extends Provider {
    private _db: Connection;
    private readonly _tableName: string;
    private readonly _idColumn: string;
    private readonly _dataColumn?: string;

    constructor(db: Connection, tableName: string, options?: ProviderOptions) {
        super();
        this.items = new Collection();
        this._db = db;
        this._tableName = tableName;
        this._idColumn = options?.idColumn ?? "Id";
        this._dataColumn = options?.dataColumn;
    }

    async init(): Promise<void> {
        const [rows] = <RowDataPacket[][]> await this._db.query({
            sql: `SELECT * FROM ${this._tableName}`,
            rowsAsArray: true,
        });

        for (const row of rows) {
            this.items.set(row[this._idColumn], this._dataColumn
                ? JSON.parse(row[this._dataColumn])
                : row);
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
            return this._db.execute(exists
                ? `UPDATE ${this._tableName} SET ${this._dataColumn} = $value WHERE ${this._idColumn} = $id`
                : `INSERT INTO ${this._tableName} (${this._idColumn}, ${this._dataColumn}) VALUES ($id, $value)`, {
                $id: id,
                $value: JSON.stringify(data),
            });
        }

        return this._db.execute(exists
            ? `UPDATE ${this._tableName} SET ${key} = $value WHERE ${this._idColumn} = $id`
            : `INSERT INTO ${this._tableName} (${this._idColumn}, ${key}) VALUES ($id, $value)`, {
            $id: id,
            $value: value,
        });
    }

    delete(id: string, key: string) {
        const data = this.items.get(id) || {};
        delete data[key];

        if (this._dataColumn) {
            return this._db.execute(`UPDATE ${this._tableName} SET ${this._dataColumn} = $value WHERE ${this._idColumn} = $id`, {
                $id: id,
                $value: JSON.stringify(data),
            });
        }

        return this._db.execute(`UPDATE ${this._tableName} SET ${key} = $value WHERE ${this._idColumn} = $id`, {
            $id: id,
            $value: null,
        });
    }

    clear(id: string) {
        this.items.delete(id);
        return this._db.execute(`DELETE FROM ${this._tableName} WHERE ${this._idColumn} = $id`, { $id: id });
    }
}

export default MySQLProvider;
