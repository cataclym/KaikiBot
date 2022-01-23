import {
    AkairoClient,
    Command,
    CommandHandler,
    CommandOptions,
    InhibitorHandler,
    ListenerHandler,
} from "discord-akairo";
import MySQLProvider from "../../src/struct/db/MySQLProvider";
import { Connection as MySQLConnection } from "mysql2/promise";
import { MoneyService } from "../../src/lib/money/MoneyService";
import { PrismaClient } from "@prisma/client";

type KaikiClient = {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	botSettingsProvider: MySQLProvider;
	guildProvider: MySQLProvider;
	connection: MySQLConnection;
	orm: PrismaClient;
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
    public handleToJSON: (data: unknown) => Promise<any>;
}

export declare const KaikiUtil: ClassKaikiUtil;
