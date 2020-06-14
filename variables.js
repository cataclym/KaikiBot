// Dont change
const prefixes = ["i'm ", "im ", "i am ", "i’m "]; 
// Change these to words the bot should add reactions to //// You can add as many as you want
const prefixes2 = ["word1", "word2"]; 
const emotenames = ["emotename1", "emotename2", "emotename3", "emotename4"];

//These are role names that the bot will exclude - Members having the roles wont trigger the bot. //Currently not in use go to (../storage/names.json)
const names = ["RoleName1", "RoleName2"];

// Bot activity status
const activityname = "Renai circulation" // Edit for song/game/media.
const activitystatus = "LISTENING" // change to one of: WATCHING/LISTENING/PLAYING.

module.exports = { names, prefixes, prefixes2, emotenames, activityname, activitystatus };
