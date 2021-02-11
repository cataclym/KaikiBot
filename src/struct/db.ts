/* eslint-disable @typescript-eslint/no-explicit-any */
import mongodb, { Error } from "mongoose";
import { ITinder, IUser, IGuild } from "../interfaces/db";
import { logger } from "../nsb/Logger";
import { guildsDB, usersDB, tinderDataDB } from "./models";

mongodb.connect("mongodb://localhost:27017/nsb", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		// If it connects log the following
		logger.info("Connected to the Mongodb database.", "log");
	})
	.catch((err) => {
		// If it doesn't connect log the following
		logger.high("Unable to connect to the Mongodb database. Error:" + err, "error");
	});

// Create/find Guilds Database
export async function getUserDB(userID: string): Promise<IUser> {
	let userDB = await usersDB.findOne({ id: userID });
	if (userDB) {
		return userDB;
	}
	else {
		userDB = new usersDB({
			id: userID,
		});
		await userDB.save().catch((err: Error) => console.log(err));
		return userDB;
	}
}

// Create/find Guilds Database
export async function getGuildDB(guildID: string): Promise<IGuild> {
	let guildDB = await guildsDB.findOne({ id: guildID });

	if (guildDB) {
		return guildDB;
	}
	else {
		guildDB = new guildsDB({
			id: guildID,
		});
		await guildDB.save().catch((err: Error) => console.log(err));
		return guildDB;
	}
}

export async function getTinderDB(userID: string): Promise<ITinder> {
	let tinderDB = await tinderDataDB.findOne({ id: userID });

	if (tinderDB) {
		return tinderDB;
	}
	else {
		tinderDB = new tinderDataDB({
			id: userID,
		});
		await tinderDB.save().catch((err: Error) => console.log(err));
		return tinderDB;
	}
}