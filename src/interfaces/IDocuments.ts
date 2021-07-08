import { ActivityType, Snowflake } from "discord-api-types";
import { ColorResolvable } from "discord.js";
import { Document } from "mongoose";

export type TGreetMessage = {
	enabled: boolean,
	channel: string,
	message: string,
	image: false | string,
	embed: boolean,
	color: string | number,
}

export interface IGuild extends Document {
	id: string,
	registeredAt: number,
	leaveRoles: {[userID: string]: string[]},
	userRoles: {[userID: string]: string},
	emojiStats: {[emojiID: string]: number},
	emojiReactions: {[keyWord: string]: string},
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
		welcome: TGreetMessage,
		goodbye: TGreetMessage,
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
    id: string,
	settings: {
        activity: string,
        activityType: ActivityType,
        currencyName: string,
        currencySymbol: string,
    }
}

export interface IMoney extends Document {
    id: string,
    amount: number,
}
