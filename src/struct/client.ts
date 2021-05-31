import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Intents } from "discord.js";
import { join } from "path";
import { guildsDB } from "./models";

export const prefixCache: {[index: string]: string} = {};

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	guildSettings: MongooseProvider;
	constructor() {
		super({
			ownerID: process.env.OWNER as Snowflake,
			intents: [Intents.ALL],
		},
		{
			allowedMentions: { parse: ["users"], repliedUser: true },
			intents: [Intents.ALL],
			partials: ["REACTION", "CHANNEL"],
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
			prefix: message => {
				if (message.guild) {
					let guildPrefix = prefixCache[message.guild.id];
					if (guildPrefix) return guildPrefix;

					guildPrefix = this.guildSettings.get(message.guild.id, "prefix", process.env.PREFIX);
					prefixCache[message.guild.id] = guildPrefix;
					return guildPrefix;
				}
				return process.env.PREFIX as string;
			},
		});

		this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../listeners") });
		this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../inhibitors") });

		this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();

		this.guildSettings.init();
	}
}