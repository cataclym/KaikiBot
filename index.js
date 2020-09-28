"use strict";
const Akairo = require("discord-akairo");
const { join } = require("path");
const { prefix, token, ownerID } = require("./config.js");
const client = new Akairo.AkairoClient({
	"ownerID": ownerID,
},
{
	"shards": "auto",
	"disableMentions": "everyone",
});
this.commandHandler = new Akairo.CommandHandler(client, {
	prefix: prefix,
	blockBots: true,
	defaultCooldown: 3000,
	blockClient: true,
	directory: join(__dirname, "commands"),
	allowMention: false,
	automateCategories: true,
	commandUtil: true,
	handleEdits: true,
});
this.listenerHandler = new Akairo.ListenerHandler(client, {
	directory: join(__dirname, "listeners"),
});
this.listenerHandler.setEmitters({
	commandHandler: this.commandHandler,
});
this.commandHandler.useListenerHandler(this.listenerHandler);

this.listenerHandler.loadAll();
this.commandHandler.loadAll();

process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection", error));
// Thanks D.js guide // Does this even work? xd // Ayy it worked once

client.login(token).catch(err => {
	console.log(err);
});