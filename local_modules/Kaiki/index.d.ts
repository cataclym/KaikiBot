import {
	AkairoClient,
	Command,
	CommandHandler,
	CommandOptions,
	InhibitorHandler,
	ListenerHandler,
	MongooseProvider
} from "discord-akairo";
// import { SequelizeDB } from "../../src/struct/db/sequelize";

export declare interface KaikiCommandOptions extends CommandOptions {
	usage?: string | string[],
}

export declare type KaikiClient = {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	guildSettings: MongooseProvider;
	botSettings: MongooseProvider;
	botSettingID: string;
	// sequelize: SequelizeDB;
} & AkairoClient

export declare class KaikiCommand extends Command {
	public usage?: string | string[];
	public client: KaikiClient;

	public constructor(id: string, options: KaikiCommandOptions);
}

declare class ClassKaikiUtil {
	public handleToJSON: (data: unknown) => Promise<any>
}

export declare const KaikiUtil: ClassKaikiUtil;
