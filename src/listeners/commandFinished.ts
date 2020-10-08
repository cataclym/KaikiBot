import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class commandFinishedListener extends Listener {
	constructor() {
		super("commandFinished", {
			event: "commandFinished",
			emitter: "commandHandler",
		});
	}

	public async exec(message: Message, command: Command): Promise<void> {
		if (message.channel.type !== "dm") {
			const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });
			console.log(`🟢 ${date} | ${message.guild?.name} | #${message.channel.name} | ${message.author.username} executed ${command.id}` +
		`\n🔢 GuildID: ${message.guild?.id} | ChanID: ${message.channel.id} | UserID: ${message.author.id}`);
		}
	}
}

