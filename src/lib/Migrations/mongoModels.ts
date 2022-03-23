import { model, Schema } from "mongoose";
import KaikiUtil from "../Kaiki/KaikiUtil";
import { IBlacklist, IBot, ICommandStats, IGuild, IMigration, IMoney, ITinder, IUser } from "./IMongoModels";

export const guildSchema = new Schema({
    // ID of the guild
    id: {
        type: String,
    },
    registeredAt: {
        type: Number, default: Date.now(),
    },
    leaveRoles: {
        type: Object, default: {},
    },
    userRoles: {
        type: Object, default: {},
    },
    emojiStats: {
        type: Object, default: {},
    },
    emojiReactions: {
        type: Object, default: {},
    },
    blockedCategories: {
        type: Object, default: {},
    },

    settings: {
        type: Object, default: {
            prefix: process.env.PREFIX,
            anniversary: false,
            dadBot: {
                enabled: false,
                excludedChannels: {},
            },
            errorColor: KaikiUtil.errorColor,
            okColor: KaikiUtil.okColor,
            excludeRole: "Dadbot-excluded",
            welcome: {
                enabled: false,
                channel: null,
                embed: {
                    "plainText": null,
                    "title": "New user joined!",
                    "url": null,
                    "description": "Welcome to %guild%, %member%!",
                    "author": null,
                    "color": 53380,
                    "footer": null,
                    "thumbnail": null,
                    "image": null,
                    "fields": null,
                },
                timeout: null,
            },
            goodbye: {
                enabled: false,
                channel: null,
                embed: {
                    "plainText": null,
                    "title": "User left",
                    "url": null,
                    "description": "%member% just left the server 👋",
                    "author": null,
                    "color": 53380,
                    "footer": null,
                    "thumbnail": null,
                    "image": null,
                    "fields": null,
                },
                timeout: null,
            },
            stickyRoles: false,
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
        type: Object, default: {},
    },
});

export const blacklistSchema = new Schema({
    blacklist: {
        type: Object, default: {},
    },
});

export const botSchema = new Schema({
    settings: {
        type: Object, default: {
            activity: "",
            activityType: "",
            currencyName: "Yen",
            currencySymbol: "💴",
            dailyEnabled: false,
            dailyAmount: 250,
        },
    },
});

export const moneySchema = new Schema({
    id: {
        type: String, default: "", index: true,
    },
    amount: {
        type: Number, default: 0,
    },
});

const _MigrationsSchema = new Schema({
    migrationId: {
        type: String,
        required: true,
    },
    versionString: {
        type: String,
        required: true,
    },
});

export const blacklistModel = model<IBlacklist>("Blacklist", blacklistSchema);
export const botModel = model<IBot>("BotDB", botSchema);
export const commandStatsModel = model<ICommandStats>("CommandStats", commandStatsSchema);
export const guildsModel = model<IGuild>("Guild", guildSchema);
export const moneyModel = model<IMoney>("Money", moneySchema);
export const tinderDataModel = model<ITinder>("Tinder", tinderDataSchema);
export const usersModel = model<IUser>("Member", usersSchema);
export const _MigrationsModel = model<IMigration>("_Migrations", _MigrationsSchema);
