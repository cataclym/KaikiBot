import { Connection, createConnection } from "mysql2/promise";
import { tableQueries } from "../constants";

export class Database {
  public connection: Connection;

  constructor() {
      createConnection({
          user: process.env.MYSQL_USER || "root",
          password: process.env.MYSQL_PASS || "root",
          host: "127.0.0.1",
          port: 3306,
          database: "kaikidb",
      // debug: true,
      })
          .then(c => {
              this.connection = c;
              // Create all tables
              Object.values(tableQueries).forEach((v) => {
                  void this.connection.query(v);
              });
          })
          .catch((err) => {
            throw err;
          });
  }
}

export default new Database();
