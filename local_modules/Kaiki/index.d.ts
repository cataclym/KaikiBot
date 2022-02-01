import {
    AkairoClient,
    Command,
    CommandHandler,
    CommandOptions,
    Inhibitor,
    InhibitorHandler,
    InhibitorOptions,
    Listener,
    ListenerHandler,
    ListenerOptions,
} from "discord-akairo";
import MySQLProvider from "../../src/struct/db/MySQLProvider";
import { Connection as MySQLConnection } from "mysql2/promise";
import { MoneyService } from "../../src/lib/money/MoneyService";
import { PrismaClient } from "@prisma/client";
import Cache from "../../src/cache/cache";
import AnniversaryRolesService from "../../src/lib/AnniversaryRolesService";

type KaikiClient = {
  anniversaryService: AnniversaryRolesService;
  botSettingsProvider: MySQLProvider;
	commandHandler: CommandHandler;
	connection: MySQLConnection;
	guildProvider: MySQLProvider;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	money: MoneyService;
	orm: PrismaClient;
  cache: Cache;
  initializeServices: () => Promise<void>;
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

export declare class KaikiListener extends Listener {
    public client: KaikiClient;

    public constructor(id: string, options?: ListenerOptions);
}
