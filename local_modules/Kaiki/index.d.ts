import { Command, CommandOptions } from "discord-akairo";

declare interface KaikiCommandOptions extends CommandOptions {
		usage?: string | string[],
	}

declare class KaikiCommand extends Command {
		public usage?: string | string[];

		public constructor(id: string, options: KaikiCommandOptions);
}