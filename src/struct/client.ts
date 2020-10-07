import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { join } from "path";
import { prefix, ownerID } from "../config";

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	eventHandler: ListenerHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	constructor() {
		super({
			"ownerID": ownerID,
		},
		{
			"shards": "auto",
			"disableMentions": "everyone",
		});

		this.commandHandler = new CommandHandler(this, {
			prefix: prefix,
			blockBots: true,
			defaultCooldown: 3000,
			blockClient: true,
			directory: join(__dirname, "../commands"),
			allowMention: false,
			automateCategories: true,
			commandUtil: true,
			handleEdits: true,
		});
		this.listenerHandler = new ListenerHandler(this, {
			directory: join(__dirname, "../listeners"),
		});
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
		});
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}
}