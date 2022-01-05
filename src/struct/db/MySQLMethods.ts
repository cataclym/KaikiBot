// import { Connection, FieldPacket, OkPacket } from "mysql2/promise";
//
// export default class MySQLMethods {
//   private db: Connection;
//
//   constructor(db: Connection) {
//       this.db = db;
//   }
//
//   insertOne(sql: string, values?: any): Promise<[OkPacket, FieldPacket[]]> {
//       return this.db.query<OkPacket>(sql, values);
//   }
//
//   insertMultiple(sql: string, values?: any): Promise<any> {
//       return this.db.query(sql, values);
//   }
// }
