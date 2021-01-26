import { Collection } from "discord.js";
import { model, Schema } from "mongoose";
import { errorColor, okColor } from "../nsb/Util";
import { config } from "../config";

export const guildsDB = model("Guild", new Schema({
	// ID of the guild
	id: {
		type: String,
	},
	registeredAt: {
		type: Number, default: Date.now(),
	},
	prefix: {
		type: String, default: config.prefix,
	},
	leaveRoles: {
		type: Object, default: {
			pairs: new Collection(),
		},
	},

	addons: {
		type: Object, default: {
			anniversary: {
				// Anniversary roles feature enabled
				enabled: false,
			},
			dadbot: {
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
				image: false,
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
				image: false,
				// Check if embed is enabled
				embed: false,
			},
		},
	},
}));

export const usersDB = model("Member", new Schema({
	// ID of the user
	id: {
		type: String,
	},
	// ID of the guild
	guild: {
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

}));

export const tinderDataDB = model("Tinder", new Schema({
	// ID of the user
	id: {
		type: String,
	},
	// Array of IDs
	datingIDs: {
		type: Array, default: null,
	},
	// Array of IDs
	marriedIDs: {
		type: Array, default: null,
	},
	// Array of IDs
	likeIDs: {
		type: Array, default: null,
	},
	// Array of IDs
	dislikeIDs: {
		type: Array, default: null,
	},
	// Array of IDs
	temporary: {
		type: Array, default: null,
	},
	// Number of likes
	likes: {
		type: Number, default: 3,
	},
	// Number of rolls
	rolls: {
		type: Number, default: 15,
	},

}));
