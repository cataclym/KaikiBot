import { ColorResolvable } from "discord.js";
import { Document } from "mongoose";

type TGreetMessage = {
	enabled: boolean,
	channel: string,
	message: string,
	image: string,
	embed: boolean,
}

export interface IGuild extends Document {
	id: string;
	registeredAt: number;
	leaveRoles: {[index: string]: string[]};
	userRoles: {[index: string]: string};
	emojiStats: {[index: string]: number};
	addons: {
		prefix: string,
		anniversary: boolean,
		dadBot: boolean,
		errorColor: ColorResolvable,
		okColor: ColorResolvable,
		welcome: TGreetMessage,
		goodbye: TGreetMessage,
	},
}

export interface ITinder extends Document {
	id: string,
	tinderData: {
		datingIDs: string[],
		marriedIDs: string[],
		likeIDs: string[],
		dislikeIDs: string[],
		temporary: string[],
		likes: number,
		rolls: number,
	},
}

export interface IUser extends Document {
	id: string,
	registeredAt: number,
	userNicknames: string[],
	todo: string[],
}