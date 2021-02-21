import { model, Schema } from "mongoose";
import { errorColor, okColor } from "../nsb/Util";
import { config } from "../config";
import { IGuild, ITinder, IUser, ICommandStats } from "../../src/interfaces/db";

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
				// Goodbye features are enabled
				enabled: false,
				// ID for channel to send messages to
				channel:  null,
				// Custom message
				message: null,
				// Check if image is enabled
				image: false,
				// Check if embed is enabled
				embed: false,
			},
		},
	},
});

export const usersSchema = new Schema({
	// ID of the user
	id: {
		type: String,
	},
	// Date
	registeredAt: {
		type: Number, default: Date.now(),
	},
	// Array of past nicknames
	userNicknames: {
		type: Array, default: [],
	},
	todo: {
		type: Array, default: [],
	},
});

export const tinderDataSchema = new Schema({
	// ID of the user
	id: {
		type: String,
	},
	tinderData: {
		type: Object, default: {
			// Array of IDs
			datingIDs: [],
			// Array of IDs
			marriedIDs: [],
			// Array of IDs
			likeIDs: [],
			// Array of IDs
			dislikeIDs: [],
			// Array of IDs
			temporary: [],
			// Number of likes
			likes: 3,
			// Number of rolls
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
