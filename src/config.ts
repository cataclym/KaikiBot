import { ActivityType } from "discord.js";

export type BotConfig = {
	prefix: string,
	token: string,
	holidayKey: string,
	dadbotRole: string,
	activityName: string,
	activityStatus: ActivityType | number,
	ownerID: string,
}

export const config: BotConfig = {

	// Change to whatever you like
	prefix: ";",
	// Input your bot token here
	token: "",

	// Grab an API key at https://holidayapi.com/ // Or leave it empty
	holidayKey: "",

	// This is the role that the bot will exclude
	dadbotRole: "Dadbot-excluded",

	// Bot activity status
	// Edit for song/game/media
	activityName: "Renai Circulation",
	// change to one of: "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "COMPETING"
	activityStatus: "LISTENING",

	// Owner ID (Used for owner only commands)
	ownerID: "140788173885276160",

};