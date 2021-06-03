import { model, Schema } from "mongoose";
import { IBlacklist, IBotDB, ICommandStats, IGuild, IMoney, ITinder, IUser } from "../../src/interfaces/db";
import { errorColor, okColor } from "../lib/Util";

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
	emojiReactions: {
		type: Object, default: {
		},
	},
	illegalWordChannel: {
		type: Object, default: {
		},
	},
	blockedCategories: {
		type: Object, default: {
		},
	},

	settings: {
		type: Object, default: {
			prefix: process.env.PREFIX,
			anniversary: false,
			dadBot: false,
			errorColor: errorColor,
			okColor: okColor,
			excludeRole: "Dadbot-excluded",
			welcome: {
				enabled: false,
				channel: null,
				message: null,
				image: false,
				embed: false,
				color: okColor,
			},
			goodbye: {
				enabled: false,
				channel: null,
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
	datingIDs: {
		type: Array, default: [],
	},
	marriedIDs: {
		type: Array, default: [],
	},
	likeIDs: {
		type: Array, default: [],
	},
	dislikeIDs: {
		type: Array, default: [],
	},
	temporary: {
		type: Array, default: [],
	},
	likes: {
		type: Number, default: 3,
	},
	rolls: {
		type: Number, default: 15,
	},
});

export const commandStatsSchema = new Schema({
	count: {
		type: Object, default: {
		},
	},
});

export const blacklistSchema = new Schema({
	blacklist: {
		type: Object, default: {
		},
	},
});

export const botSchema = new Schema({
	activity: {
		type: String, default: "",
	},
	activityType: {
		type: String, default: "",
	},
});

export const moneySchema = new Schema({
    id: {
        type: String, default: "",
    },
    amount: {
        type: Number, default: 0
    }
})

export const guildsDB = model<IGuild>("Guild", guildSchema);
export const commandStatsDB = model<ICommandStats>("CommandStats", commandStatsSchema);
export const tinderDataDB = model<ITinder>("Tinder", tinderDataSchema);
export const usersDB = model<IUser>("Member", usersSchema);
export const blacklistDB = model<IBlacklist>("Blacklist", blacklistSchema);
export const botDB = model<IBotDB>("BotDB", botSchema);
export const moneyDB = model<IMoney>("Money", moneySchema);
