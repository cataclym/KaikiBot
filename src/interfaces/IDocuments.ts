import { ActivityType } from "discord-api-types";
import { ColorResolvable } from "discord.js";
import { Document } from "mongoose";
import { IGreet } from "./IGreetLeave";
import { emoteReactObjectType } from "../cache/cache";

export interface IGuild extends Document {
	id: string,
	registeredAt: number,
	leaveRoles: {[userID: string]: string[]},
	userRoles: {[userID: string]: string},
	emojiStats: {[emojiID: string]: number},
	emojiReactions: emoteReactObjectType,
    blockedCategories: {[categoryID: string]: boolean };
    settings: {
		prefix: string,
		anniversary: boolean,
		dadBot: {
			enabled: boolean,
			excludedChannels: {[id: string]: true | undefined},
		},
		errorColor: ColorResolvable,
		okColor: ColorResolvable,
        excludeRole: string,
		welcome: IGreet,
		goodbye: IGreet,
		stickyRoles: boolean,
	},
}

export interface ITinder extends Document {
	id: string,
	datingIDs: string[],
	marriedIDs: string[],
	likeIDs: string[],
	dislikeIDs: string[],
	temporary: string[],
	likes: number,
	rolls: number,
}

export interface IUser extends Document {
	id: string,
	registeredAt: number,
	userNicknames: string[],
	todo: string[],
}

export interface ICommandStats extends Document {
	count: {[commandAlias: string]: number},
}

export interface IBlacklist extends Document {
	blacklist: {[id: string]: true},
}

export interface IBot extends Document {
	settings: {
        activity: string,
        activityType: ActivityType,
        currencyName: string,
        currencySymbol: string,
		dailyEnabled: boolean,
		dailyAmount: number,
    }
}

export interface IMoney extends Document {
    id: string,
    amount: number,
}

export interface IMigration extends Document {
	migrationId: string,
	versionString: string,
}
