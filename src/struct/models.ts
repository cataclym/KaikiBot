import { model, Schema } from "mongoose";
import { ICommandStats, IGuild, ITinder, IUser } from "../../src/interfaces/db";
import { config } from "../config";
import { errorColor, okColor } from "../nsb/Util";

export const guildSchema = new Schema({
	// ID of the guild
	id: {
		type: String,
	},
	registeredAt: {
		type: Number, default: Date.now(),
	},
	leaveRoles: {
		type: Object, default: {
		},
	},
	userRoles: {
		type: Object, default: {
		},
	},
	emojiStats: {
		type: Object, default: {
		},
	},

	settings: {
		type: Object, default: {
			prefix: config.prefix,
			anniversary: false,
			dadBot: false,
			errorColor: errorColor,
			okColor: okColor,
			welcome: {
				enabled: false,
				channel:  null,
				message: null,
				image: false,
				embed: false,
				color: okColor,
			},
			goodbye: {
				enabled: false,
				channel:  null,
				message: null,
				image: false,
				embed: false,
				color: okColor,
			},
		},
	},
});

export const usersSchema = new Schema({
	id: {
		type: String,
	},
	registeredAt: {
		type: Number, default: Date.now(),
	},
	userNicknames: {
		type: Array, default: [],
	},
	todo: {
		type: Array, default: [],
	},
});

export const tinderDataSchema = new Schema({
	id: {
		type: String,
	},
	tinderData: {
		type: Object, default: {
			datingIDs: [],
			marriedIDs: [],
			likeIDs: [],
			dislikeIDs: [],
			temporary: [],
			likes: 3,
			rolls: 15,
		},
	},
});

export const commandStatsSchema = new Schema({
	id: {
		type: String,
	},
	count: {
		type: Object, default: {
		},
	},
});

export const guildsDB = model<IGuild>("Guild", guildSchema);
export const commandStatsDB = model<ICommandStats>("CommandStats", commandStatsSchema);
export const tinderDataDB = model<ITinder>("Tinder", tinderDataSchema);
export const usersDB = model<IUser>("Member", usersSchema);
