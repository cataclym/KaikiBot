// Dont change
const prefixes = ["i'm ", "im ", "i am ", "i’m "]; 
// Change these to words the bot should add reactions to //// Keep a space after words //// You can add as many as you want
const prefixes2 = ["yay", "ononoki", "yotsugi", "doll"];
const emotenames = ["onoyay", "onohatderp", "onohands", "onochibi"];
//These are role names that the bot will exclude - Members having the roles wont trigger the bot.
const names = ["RoleName1", "RoleName2"];

// Bot activity status
const activityname = "Renai circulation" // Edit for song/game/media.
const activitystatus = "LISTENING" // change to one of: WATCHING/LISTENING/PLAYING.

module.exports = { names, prefixes, prefixes2, emotenames, activityname, activitystatus };