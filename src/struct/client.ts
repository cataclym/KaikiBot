import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from "@cataclym/discord-akairo";
import { guildsDB, tinderDataDB, usersDB } from "./models";
import { join } from "path";
import { config } from "../config";

const prefixCache: {[index: string]: string} = {};

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	addons: MongooseProvider;
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

		this.addons = new MongooseProvider(guildsDB);
		this.userNicknames = new MongooseProvider(usersDB);
		this.tinderData = new MongooseProvider(tinderDataDB);
		this.userRoles = new MongooseProvider(guildsDB);
		this.leaveRoles = new MongooseProvider(guildsDB);
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

					let gPrefix = prefixCache[message.guild.id];
					if (gPrefix) return gPrefix;

					// The third param is the default.
					gPrefix = this.addons.get(message.guild.id, "prefix", config.prefix);
					prefixCache[message.guild.id] = gPrefix;
					return gPrefix;
				}

				return config.prefix;
			},
		});

		this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../listeners") });
		this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });
		this.commandHandler.useListenerHandler(this.listenerHandler);

		(this.addons, this.tinderData, this.userNicknames, this.userRoles, this.leaveRoles).init();
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}
}