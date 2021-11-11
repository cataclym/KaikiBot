import { Command, CommandOptions } from "discord-akairo";

export declare interface KaikiCommandOptions extends CommandOptions {
	usage?: string | string[],
}

export declare class KaikiCommand extends Command {
	public usage?: string | string[];

	public constructor(id: string, options: KaikiCommandOptions);
}

declare class ClassKaikiUtil {
	public handleToJSON: (data: unknown) => Promise<any>
}

export declare const KaikiUtil: ClassKaikiUtil;
