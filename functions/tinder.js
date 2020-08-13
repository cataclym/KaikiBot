const db = require("quick.db");
const Tinder = new db.table("Tinder");
const Discord = require("discord.js");
const { timeToMidnight, msToTime } = require("./functions");

function TinderProfile(message) {
	//...
}
async function TinderStartup(message) { // This will spam the console from TinderDBService sadly // Edit: fixed it somewhat.
	let i = 0;
	message.client.users.cache.forEach(user => {
		TinderDBService(user);
		i++;
	});
	console.log("Tinder Database Service | Tinder has completed startup procedure. | " + i + " Changes registered (This represents one server)");
}
async function TinderDBService(user) { // This is the peak of JS
	let i = 0;
	if (!Tinder.has(`rolls.${user.id}`)) { Tinder.add(`rolls.${user.id}`, 15); i++; }	
	if (!Tinder.has(`likes.${user.id}`)) { Tinder.add(`likes.${user.id}`, 3); i++; }
	if (!Tinder.has(`dating.${user.id}`)) { Tinder.push(`dating.${user.id}`, user.id); i++; }
	if (!Tinder.has(`likeID.${user.id}`)) { Tinder.push(`likeID.${user.id}`, user.id); i++; }
	if (!Tinder.has(`dislikeID.${user.id}`)) { Tinder.push(`dislikeID.${user.id}`, user.id); i++; }	 
	if (!Tinder.has(`married.${user.id}`)) { Tinder.push(`married.${user.id}`, user.id); i++; }
	if (i > 0) {
		console.log("Tinder Database Service | Checking " + user.username + " | Ran " + i + " changes.");
	}
}
function NoLikes() {
	const time2mid = timeToMidnight();
	const time2midHrs = msToTime(time2mid);
	return "You don't have any more likes!\nLikes and rolls reset in: " + time2midHrs;
}
function NoRolls() {
	const time2mid = timeToMidnight();
	const time2midHrs = msToTime(time2mid);
	return "You don't have any more rolls!\nLikes and rolls reset in: " + time2midHrs;
}
function SeparateTinderList(message, Item)
{
	Item.shift();
	let i = 0;
	const initialList = Item.map((item, i) => `**${+i + 1}**. ${message.client.users.cache.find(member => member.id === item)?.username}`);
	let CombinedList = "";
	do {
		CombinedList += initialList.slice(i, i+10).join(" ") + "\n";
		i += 10;
	}
	while ( i < Item.length);
	return message.channel.send(initialList.length ? CombinedList : "N/A");
}

module.exports = {
	TinderProfile, TinderStartup, TinderDBService, NoLikes, NoRolls, SeparateTinderList 
};