import mongodb, { Error } from "mongoose";
import { config } from "../config";

export const guildsDB = mongodb.model("Guild", new mongodb.Schema({
	// ID of the guild
	id: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	prefix: { type: String, default: config.prefix },

	addons: { type: Object, default: {
		dadbot: {
			// Dadbot feature enabled
			enabled: false,
		},
		anniversary: {
			// Anniversary roles feature enabled
			enabled: false,
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

export const userDB = mongodb.model("Member", new mongodb.Schema({
	// ID of the user
	id: { type: String },
	// ID of the guild
	guild: { type: String },
	registeredAt: { type: Number, default: Date.now() },

}));

export const tinderDataDB = mongodb.model("Tinder", new mongodb.Schema({
	// ID of the user
	id: { type: String },
	registeredAt: { type: Number, default: Date.now() },

}));
