import { model, Schema } from "mongoose";
import { errorColor, okColor } from "../nsb/Util";
import { config } from "../config";
import { IGuild, ITinder, IUser } from "../../src/interfaces/db";

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

	addons: {
		type: Object, default: {
			prefix: config.prefix,

			anniversary: {
				// Anniversary roles feature enabled
				enabled: false,
			},
			dadBot: {
				// Dadbot feature enabled
				enabled: false,
			},
			errorColor: {
				color: errorColor,
			},
			okColor: {
				color: okColor,
			},
			welcome: {
				// Welcome features are enabled
				enabled: false,
				// ID for the channel to send messages to
				channel:  null,
				// Custom message
				message: null,
				// Check if image is enabled
				image: null,
				// Check if embed is enabled
				embed: false },
			goodbye: {
				// Goodbye features are enabled
				enabled: false,
				// ID for channel to send messages to
				channel:  null,
				// Custom message
				message: null,
				// Check if image is enabled
				image: null,
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

export const guildsDB = model<IGuild>("Guild", guildSchema);
export const tinderDataDB = model<ITinder>("Tinder", tinderDataSchema);
export const usersDB = model<IUser>("Member", usersSchema);
