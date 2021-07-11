import { Command, CommandOptions } from "discord-akairo";

interface KaikiCommandOptions extends CommandOptions {
	usage?: string | string[],
}

export class KaikiCommand extends Command {
		public usage?: string | string[];
		constructor(id: string, options?: KaikiCommandOptions) {
			super(id, options);
			this.usage = options?.usage;
		}
}
