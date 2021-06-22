/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "loglevel";
import { IBlacklist, IBot, ICommandStats, IGuild, ITinder, IUser } from "../interfaces/IDocuments";
import { blacklistModel, botModel, commandStatsModel, guildsModel, tinderDataModel, usersModel } from "./models";

export async function getUserDocument(userID: string): Promise<IUser> {
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

export async function getGuildDocument(guildID: string): Promise<IGuild> {

	let guildDB = await guildsModel.findOne({ id: guildID });

	if (!guildDB) {
		guildDB = new guildsModel({ id: guildID });
	}

	return await guildDB.save();
}

export async function getTinderDocument(userID: string): Promise<ITinder> {
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

export async function getCommandStatsDocument(): Promise<ICommandStats> {
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

export async function getBlacklistDocument(): Promise<IBlacklist> {
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

export async function getBotDocument(): Promise<IBot> {
	let bot = await botModel.findOne();

	if (bot) {
		return bot;
	}
	else {
		bot = new botModel;

		await bot.save().catch(err => logger.error(err));
		return bot;
	}
}
