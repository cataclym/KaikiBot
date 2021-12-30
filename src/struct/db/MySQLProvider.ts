import { Provider, ProviderOptions } from "discord-akairo";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Collection } from "discord.js";

class MySQLProvider extends Provider {
  private db: Connection;
  private readonly tableName: string;
  private readonly idColumn: string;
  private readonly dataColumn?: string;

  constructor(db: Connection, tableName: string, options?: ProviderOptions) {
      super();
      this.items = new Collection();
      this.db = db;
      this.tableName = tableName;
      this.idColumn = options?.idColumn ?? "id";
      this.dataColumn = options?.dataColumn;
  }

  async init(): Promise<void> {
      const [rows] = <RowDataPacket[][]> await this.db.query({
          sql: `SELECT * FROM ${this.tableName}`,
          rowsAsArray: true,
      });

      for (const row of rows) {
          this.items.set(row[this.idColumn], this.dataColumn ? JSON.parse(row[this.dataColumn]) : row);
      }
  }

  async get(id: string, key: string, defaultValue: any) {
      if (this.items.has(id)) {
          const value = this.items.get(id)[key];
          return value == null ? defaultValue : value;
      }

      return defaultValue;
  }

  async set(id: string, key: string, value: any) {
      const data = this.items.get(id) || {};
      const exists = this.items.has(id);

      data[key] = value;
      this.items.set(id, data);

      if (this.dataColumn) {
          return this.db.execute(exists
              ? `UPDATE ${this.tableName} SET ${this.dataColumn} = $value WHERE ${this.idColumn} = $id`
              : `INSERT INTO ${this.tableName} (${this.idColumn}, ${this.dataColumn}) VALUES ($id, $value)`, {
              $id: id,
              $value: JSON.stringify(data),
          });
      }

      return this.db.execute(exists
          ? `UPDATE ${this.tableName} SET ${key} = $value WHERE ${this.idColumn} = $id`
          : `INSERT INTO ${this.tableName} (${this.idColumn}, ${key}) VALUES ($id, $value)`, {
          $id: id,
          $value: value,
      });
  }

  async delete(id: string, key: string) {
      const data = this.items.get(id) || {};
      delete data[key];

      if (this.dataColumn) {
          return this.db.execute(`UPDATE ${this.tableName} SET ${this.dataColumn} = $value WHERE ${this.idColumn} = $id`, {
              $id: id,
              $value: JSON.stringify(data),
          });
      }

      return this.db.execute(`UPDATE ${this.tableName} SET ${key} = $value WHERE ${this.idColumn} = $id`, {
          $id: id,
          $value: null,
      });
  }

  async clear(id: string) {
      this.items.delete(id);
      return this.db.execute(`DELETE FROM ${this.tableName} WHERE ${this.idColumn} = $id`, { $id: id });
  }
}

export default MySQLProvider;
