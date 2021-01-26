import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from "@cataclym/discord-akairo";
import { guildsDB, tinderDataDB, usersDB } from "./models";
import { join } from "path";
import { config } from "../config";

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	guildDB: MongooseProvider;
	userDB: MongooseProvider;
	tinderDB: MongooseProvider;
	constructor() {
		super({
			ownerID: config.ownerID,
		},
		{
			disableMentions: "everyone",
			partials: ["REACTION"],
			presence: {
				activity: { type: config.activityStatus, name: config.activityName },
			},
			shards: "auto",
			ws: { properties: { $browser: "Discord Android" } },
		});

		this.guildDB = new MongooseProvider(guildsDB);
		this.userDB = new MongooseProvider(usersDB);
		this.tinderDB = new MongooseProvider(tinderDataDB);

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
					// The third param is the default.
					return this.guildDB.get(message.guild.id, "prefix", config.prefix);
				}

				return config.prefix;
			},
		});

		this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../listeners") });
		this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });
		this.commandHandler.useListenerHandler(this.listenerHandler);

		(this.guildDB, this.tinderDB, this.userDB).init();
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}
}