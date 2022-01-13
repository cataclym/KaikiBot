// import { IWrite } from "../../../interfaces/repositories/IWrite";
// import { IRead } from "../../../interfaces/repositories/IRead";
// import { Connection, OkPacket } from "mysql2/promise";
//
// export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
//     // creating a property to use your code in all instances
//     // that extends your base repository and reuse on methods of class
//     public _connection: Connection;
//     private _table: string;
//
//     // we created constructor with arguments to manipulate mongodb operations
//     protected constructor(db: Connection, tableName: string) {
//         this._connection = db;
//         this._table = tableName;
//     }
//
//     // we add to method, the async keyword to manipulate the insert result
//     // of method.
//     async create(item: T): Promise<boolean> {
//         const result: OkPacket = await this._connection.query(`INSERT INTO ${this._table} (${columns.join(", ")}) VALUES ()`, values);
//
//         // after the insert operations, we returns only ok property (that haves a 1 or 0 results)
//         // and we convert to boolean result (0 false, 1 true)
//         return !!result.result.ok;
//     }
//
//     update(id: string, item: T): Promise<boolean> {
//         throw new Error("Method not implemented.");
//     }
//     delete(id: string): Promise<boolean> {
//         throw new Error("Method not implemented.");
//     }
//     find(item: T): Promise<T[]> {
//         throw new Error("Method not implemented.");
//     }
//     findOne(id: string): Promise<T> {
//         throw new Error("Method not implemented.");
//     }
// }
