import {
    AkairoClient,
    Command,
    CommandHandler,
    CommandOptions,
    Inhibitor,
    InhibitorHandler,
    InhibitorOptions,
    ListenerHandler,
} from "discord-akairo";
import MySQLProvider from "../../src/struct/db/MySQLProvider";
import { Connection as MySQLConnection } from "mysql2/promise";
import { MoneyService } from "../../src/lib/money/MoneyService";
import { PrismaClient } from "@prisma/client";

type KaikiClient = {
	botSettingsProvider: MySQLProvider;
	commandHandler: CommandHandler;
	connection: MySQLConnection;
  dadBotChannelsProvider: MySQLProvider;
	guildProvider: MySQLProvider;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	money: MoneyService;
	orm: PrismaClient;
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

export declare class KaikiInhibitor extends Inhibitor {
    public client: KaikiClient;

    public constructor(id: string, options: InhibitorOptions)
}
