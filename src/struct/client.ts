import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { join } from "path";
import { config } from "../config";

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	constructor() {
		super({
			"ownerID": config.ownerID,
		},
		{
			"shards": "auto",
			"disableMentions": "everyone",
		});

		this.commandHandler = new CommandHandler(this, {
			allowMention: false,
			automateCategories: true,
			blockBots: true,
			blockClient: true,
			commandUtil: true,
			defaultCooldown: 3000,
			directory: join(__dirname, "../commands"),
			handleEdits: true,
			prefix: config.prefix,
			fetchMembers: true,
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