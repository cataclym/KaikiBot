/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "loglevel";
import { connect, connection } from "mongoose";
import { IBlacklist, IBotDB, ICommandStats, IGuild, ITinder, IUser } from "../interfaces/db";
import { blacklistModel, botModel, commandStatsModel, guildsModel, tinderDataModel, usersModel } from "./models";

connect("mongodb://localhost:27017", {
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

connection.on("error", logger.error.bind(console, "connection error:"));

export async function getUserDB(userID: string): Promise<IUser> {
	let userDB = await usersModel.findOne({ id: userID });
	if (userDB) {
		return userDB;
	}
	else {
		userDB = new usersModel({
			id: userID,
		});
		await userDB.save().catch(err => logger.error(err));
		return userDB;
	}
}

export async function getGuildDB(guildID: string): Promise<IGuild> {

	let guildDB = await guildsModel.findOne({ id: guildID });

	if (!guildDB) {
		guildDB = new guildsModel({ id: guildID });
	}

	return await guildDB.save();
}

export async function getTinderDB(userID: string): Promise<ITinder> {
	let tinderDB = await tinderDataModel.findOne({ id: userID });

	if (tinderDB) {
		return tinderDB;
	}
	else {
		tinderDB = new tinderDataModel({ id: userID });
		await tinderDB.save().catch(err => logger.error(err));
		return tinderDB;
	}
}

export async function getCommandStatsDB(): Promise<ICommandStats> {
	let cmdStatsDB = await commandStatsModel.findOne();

	if (cmdStatsDB) {
		return cmdStatsDB;
	}
	else {
		cmdStatsDB = new commandStatsModel();

		await cmdStatsDB.save().catch(err => logger.error(err));
		return cmdStatsDB;
	}
}

export async function getBlacklistDB(): Promise<IBlacklist> {
	let blacklist = await blacklistModel.findOne();

	if (blacklist) {
		return blacklist;
	}
	else {
		blacklist = new blacklistModel();

		await blacklist.save().catch(err => logger.error(err));
		return blacklist;
	}
}

export async function getBotDB(): Promise<IBotDB> {
	let bot = await botModel.findOne();

	if (bot) {
		return bot;
	}
	else {
		bot = new botModel();

		await bot.save().catch(err => logger.error(err));
		return bot;
	}
}
