import logger from "loglevel";
import { connect, connection } from "mongoose";

export default class MongoDb {
    constructor() {
        void this.init();
    }

    async init(): Promise<void> {
        await connect("mongodb://localhost:27017?authSource=admin'", {
            // user: process.env.DB_USER,
            // pass: process.env.DB_PASS,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "KaikiDB",
            useCreateIndex: true,
        })
            .catch((err) => {
                // If it doesn't connect log the following
                logger.error("Unable to connect to the Mongodb database. Error:" + err, "error");
            });

        connection.on("error", logger.error.bind(console, "connection error:"));
    }
}
