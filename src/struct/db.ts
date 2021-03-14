/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "loglevel";
import mongoose, { Error } from "mongoose";
import { IBlacklist, ICommandStats, IGuild, ITinder, IUser } from "../interfaces/db";
import { blacklistDB, commandStatsDB, guildsDB, tinderDataDB, usersDB } from "./models";


mongoose.connect("mongodb://localhost:27017", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: "KaikiDB",
})
	.then(() => {
		// If it connects log the following
		logger.info("Connected to the Mongodb database.");
	})
	.catch((err) => {
		// If it doesn't connect log the following
		logger.error("Unable to connect to the Mongodb database. Error:" + err, "error");
	});

const db = mongoose.connection;
db.on("error", logger.error.bind(console, "connection error:"));

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
		await userDB.save().catch((err: Error) => logger.error(err));
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
		await guildDB.save().catch((err: Error) => logger.error(err));
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
		await tinderDB.save().catch((err: Error) => logger.error(err));
		return tinderDB;
	}
}

export async function getCommandStatsDB(): Promise<ICommandStats> {
	let cmdStatsDB = await commandStatsDB.findOne();

	if (cmdStatsDB) {
		return cmdStatsDB;
	}
	else {
		cmdStatsDB = new commandStatsDB();

		await cmdStatsDB.save().catch((err: Error) => logger.error(err));
		return cmdStatsDB;
	}
}

export async function getBlacklistDB(): Promise<IBlacklist> {
	let blacklist = await blacklistDB.findOne();

	if (blacklist) {
		return blacklist;
	}
	else {
		blacklist = new blacklistDB();

		await blacklist.save().catch((err: Error) => logger.error(err));
		return blacklist;
	}
}
