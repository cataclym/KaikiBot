import logger from "loglevel";
import { connect, connection } from "mongoose";

export default class MongoDb {
	init(): void {
		connect("mongodb://localhost:27017?authSource=admin'", {
			// user: process.env.DB_USER,
			// pass: process.env.DB_PASS,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: "KaikiDB",
			useCreateIndex: true,
		})
			.then(() => {
				// If it connects, log the following
				logger.info("Connected to the Mongodb database.");
			})
			.catch((err) => {
				// If it doesn't connect log the following
				logger.error("Unable to connect to the Mongodb database. Error:" + err, "error");
			});

		connection.on("error", logger.error.bind(console, "connection error:"));
	}
}