import { Command } from "discord-akairo";
export default class NeofetchCommand extends Command {
	constructor() {
		super("neofetch", {
			aliases: ["neofetch", "neo"],
			description: { description: "display neofetch ascii art", usage: "opensuse" },
			cooldown: 2000,
			typing: true,
			args: [{
				id: "os",
				type: "string",
				default: "bedrock",
			}],
		});
	}
	async exec(): Promise<void> {

		// Putting this one ice

	}
}