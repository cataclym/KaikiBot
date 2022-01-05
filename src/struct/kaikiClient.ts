import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Intents } from "discord.js";
import { join } from "path";
import { getBotDocument } from "./documentMethods";
import { botModel, guildsModel } from "./db/models";
import logger from "loglevel";
import chalk from "chalk";
import { Migrations } from "../migrations/migrations";
import { Database } from "./db/MySQL";
import MySQLProvider from "./db/MySQLProvider";
import { Connection } from "mysql2/promise";

export class KaikiClient extends AkairoClient {
	public commandHandler: CommandHandler;
	public inhibitorHandler: InhibitorHandler;
	public listenerHandler: ListenerHandler;
	public guildSettings: MongooseProvider;
	public botSettings: MongooseProvider;
	public botSettingID: string;
	private botSettingsProvider: MySQLProvider;
	public connection: Connection;
	constructor() {
    	super({
    		ownerID: process.env.OWNER as Snowflake,
    		allowedMentions: { parse: ["users"], repliedUser: true },
    		intents: [Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    			Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    			Intents.FLAGS.DIRECT_MESSAGES,
    			Intents.FLAGS.GUILD_BANS,
    			Intents.FLAGS.GUILDS,
    			Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    			Intents.FLAGS.GUILD_INTEGRATIONS,
    			Intents.FLAGS.GUILD_INVITES,
    			Intents.FLAGS.GUILD_MEMBERS,
    			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    			// Intents.FLAGS.GUILD_MESSAGE_TYPING,
    			Intents.FLAGS.GUILD_MESSAGES,
    			Intents.FLAGS.GUILD_PRESENCES,
    			// Intents.FLAGS.GUILD_VOICE_STATES,
    			Intents.FLAGS.GUILD_WEBHOOKS],
    		partials: ["REACTION", "CHANNEL"],
    		shards: "auto",
    		// Uncomment to have mobile status on bot.
    		// ws: { properties: { $browser: "Discord Android" } },
    	});

	    new Database().init()
	        .then(r => {
	            this.connection = r;
	            this.botSettingsProvider = new MySQLProvider(this.connection, "BotSettings");
	            this.botSettingsProvider.init().then(() => logger.info(`SQL BotSettings provider - ${chalk.green("READY")}`));
	        });

	    // Mongoose Providers
	    this.guildSettings = new MongooseProvider(guildsModel);
	    this.botSettings = new MongooseProvider(botModel);


	    this.guildSettings.init().then(() => logger.info(`GuildSettings provider - ${chalk.green("READY")}`));
	    this.botSettings.init().then(() => logger.info(`BotSettings provider - ${chalk.green("READY")}`));

	    this.commandHandler = new CommandHandler(this, {
	        allowMention: true,
	        automateCategories: true,
	        blockBots: true,
	        blockClient: true,
	        commandUtil: true,
	        defaultCooldown: 2500,
	        directory: join(__dirname, "../commands"),
	        fetchMembers: true,
	        handleEdits: false,
	        prefix: message => {
	            if (message.guild) {
	                return this.guildSettings.get(message.guild.id, "prefix", process.env.PREFIX);
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
	}

	async init(): Promise<void> {
    	this.botSettingID = await (async () => {
    			return (await getBotDocument()).id;
    	})();

	    if (this.connection) {
	        new Migrations(this.connection)
	            .runAllMigrations()
	            .then((r) => {
	                if (r) {
	                    logger.info("migrationService | Migrations have been checked and executed");
	                    logger.info(`migrationService | Inserted ${r} records into kaikidb`);
	                }
	            });
	    }
	    else {
	        await this.init();
	    }
	}
}
