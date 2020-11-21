import { ActivityType } from "discord.js";

export type BotConfig = {
	prefix: string,
	token: string,
	holidayKey: string,
	prefixes: string[],
	prefixes2: string[],
	emoteNames: string[],
	names: string,
	activityName: string,
	activityStatus: ActivityType | number,
	ownerID: string,
}

export const config: BotConfig = {
	// Change to whatever you like
	prefix: "",
	// Input your bot token here
	token: "",

	// Grab an API key at https://holidayapi.com/ // Or leave it empty
	holidayKey: "",
	// Dont change
	prefixes: ["i'm ", "im ", "i am ", "i’m "],

	// Change these to words the bot should add reactions to
	// You can add as many as you want
	prefixes2: ["word1", "word2"],
	// Change these to match the emotenames to be reacted with
	emoteNames: ["emotename1", "emotename2", "emotename3", "emotename4"],
	// This is the role that the bot will exclude
	names: "Nadeko-excluded",

	// Bot activity status
	// Edit for song/game/media
	activityName: "Renai Circulation",
	// change to one of: "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "COMPETING"
	activityStatus: "LISTENING",

	// Owner ID (Used for owner only commands)
	ownerID: "140788173885276160",
};