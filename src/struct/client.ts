import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { Message } from "discord.js";
import { join } from "path";
import { config } from "../config";
import DB from "quick.db";
const guildConfig = new DB.table("guildConfig");


export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	constructor() {
		super({
			ownerID: config.ownerID,
		},
		{
			shards: "auto",
			disableMentions: "everyone",
			partials: ["REACTION"],
			presence: {
				activity: { type: config.activityStatus, name: config.activityName },
			},
		});

		this.commandHandler = new CommandHandler(this, {
			allowMention: true,
			automateCategories: true,
			blockBots: true,
			blockClient: true,
			commandUtil: true,
			defaultCooldown: 2500,
			directory: join(__dirname, "../commands"),
			fetchMembers: true,
			handleEdits: true,
			prefix: (message: Message): string | string[] => {

				if (message.guild) {
					const prefix = guildConfig.get(`${message.guild?.id}.prefix`) as string | undefined;

					if (!prefix) return config.prefix;

					return prefix;
				}
				else {
					return config.prefix;
				}
			},
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