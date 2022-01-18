import {
	AkairoClient,
	Command,
	CommandHandler,
	CommandOptions,
	InhibitorHandler,
	ListenerHandler,
	MongooseProvider
} from "discord-akairo";
import MySQLProvider from "../../src/struct/db/MySQLProvider";
import { Connection as MySQLConnection } from "mysql2/promise";
import { IDatabaseDriver, MikroORM, Connection } from "@mikro-orm/core";
import { MoneyService } from "../../src/lib/money/MoneyService";

type KaikiClient = {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	botSettingsProvider: MySQLProvider;
	guildProvider: MySQLProvider;
	connection: MySQLConnection;
	orm: MikroORM<IDatabaseDriver<Connection>>
	money: MoneyService;
} & AkairoClient;

export declare interface KaikiCommandOptions extends CommandOptions {
	usage?: string | string[],
}

export declare class KaikiCommand extends Command {
	public usage?: string | string[];
	public client: KaikiClient;

	public constructor(id: string, options: KaikiCommandOptions);
}

declare class ClassKaikiUtil {
	public handleToJSON: (data: unknown) => Promise<any>
}

export declare const KaikiUtil: ClassKaikiUtil;
