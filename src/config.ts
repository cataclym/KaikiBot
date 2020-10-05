// Change to whatever you like
const prefix = "-";
// Input your bot token here
const token = "NjQ5MzM3MzU1Mjk1MjYwNjkz.Xd7UiQ.gCdufb8gTl9c5P9KBvOTi5m62Ps";

// Grab an API key at https://holidayapi.com/ // Or leave it empty
const holidayKey = "";

// Dont change
const prefixes = ["i'm ", "im ", "i am ", "i’m "];

// Change these to words the bot should add reactions to
// You can add as many as you want
const prefixes2 = ["word1", "word2"];
// Change these to match the emotenames to be reacted with
const emoteNames = ["emotename1", "emotename2", "emotename3", "emotename4"];
// This is the role that the bot will exclude
const names = "Nadeko-excluded";

// Bot activity status
// Edit for song/game/media
const activityName = "Platinum Disco";
// change to one of: WATCHING/LISTENING/PLAYING
const activityStatus = 1;

// Owner ID (Used for owner only commands)
const ownerID = "140788173885276160";
export {
	names, prefixes, prefixes2, emoteNames, activityName, activityStatus,
	prefix, token, holidayKey, ownerID,
};
