import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Intents } from "discord.js";
import { join } from "path";
import logger from "loglevel";
import chalk from "chalk";
import { Database } from "./db/MySQL";
import MySQLProvider from "./db/MySQLProvider";
import { Connection } from "mysql2/promise";
import { Migrations } from "../migrations/migrations";

export class KaikiClient extends AkairoClient {
    public commandHandler: CommandHandler;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler;
    public botSettingsProvider: MySQLProvider;
    public guildProvider: MySQLProvider;
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
	            this.guildProvider = new MySQLProvider(this.connection, "Guilds");

	            this.botSettingsProvider.init().then(() => logger.info(`SQL BotSettings provider - ${chalk.green("READY")}`));
	            this.guildProvider.init().then(() => logger.info(`SQL Guild provider - ${chalk.green("READY")}`));

	            new Migrations(this.connection)
	                .runAllMigrations()
	                .then((res) => {
	                    if (res) {
	                        logger.info(`
${(chalk.greenBright)("------------------------------------------------------------")}
migrationService | Migrations have been checked and executed
migrationService | Inserted ${res} records into kaikidb
${(chalk.greenBright)("------------------------------------------------------------")}`);
	                    }
	                })
	                .catch(e => {
	                    throw e;
	                });
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
	        handleEdits: false,
	        prefix: message => {
	            // if (message.guild) {
	            //     return this.guildProvider.get(message.guild.id, "Prefix", process.env.PREFIX);
	            // }
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
}
