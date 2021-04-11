import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from "@cataclym/discord-akairo";
import { join } from "path";
import { config } from "../config";
import { guildsDB } from "./models";

export const prefixCache: {[index: string]: string} = {};

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	guildSettings: MongooseProvider;
	userNicknames: MongooseProvider;
	tinderData: MongooseProvider;
	userRoles: MongooseProvider;
	leaveRoles: MongooseProvider;
	constructor() {
		super({
			ownerID: config.ownerID,
		},
		{
			disableMentions: "everyone",
			partials: ["REACTION"],
			presence: { activity: { type: config.activityStatus, name: config.activityName } },
			shards: "auto",
			ws: { properties: { $browser: "Discord Android" } },
		});

		this.guildSettings = new MongooseProvider(guildsDB);
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
			prefix: (message) => {
				if (message.guild) {
					let guildPrefix = prefixCache[message.guild.id];
					if (guildPrefix) return guildPrefix;

					guildPrefix = this.guildSettings.get(message.guild.id, "prefix", config.prefix);
					prefixCache[message.guild.id] = guildPrefix;
					return guildPrefix;
				}
				return config.prefix;
			},
		});

		this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../listeners") });
		// this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../inhibitors") });

		this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		// this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();

		this.guildSettings.init();
	}
}