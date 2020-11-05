import { Command, Listener } from "discord-akairo";
import { MessageEmbed, Message, PermissionString, BitFieldResolvable } from "discord.js";
import { errorColor } from "../functions/Util";

export default class missingPermissionsListener extends Listener {
	constructor() {
		super("missingPermissions", {
			event: "missingPermissions",
			emitter: "commandHandler",
		});
	}

	// Emitted when a permissions check is failed.

	public async exec(message: Message, command: Command, type: string, missing: BitFieldResolvable<PermissionString>): Promise<NodeJS.Timeout | void> {
		const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });
		if (message.channel.type !== "dm") {
			console.log(
				// eslint-disable-next-line
	`🔵	${date} missingPermissions | ${Date.now() - message.createdTimestamp}ms
	Guild: ${message.guild?.name} [${message.guild?.id}]
	Channel: #${message.channel.name} [${message.channel.id}]
	User: ${message.author.username} [${message.author.id}]
	Executed ${command.id} | "${message.content}"`);

			const msg = await message.util?.send(new MessageEmbed({
				title: "Missing permissions",
				color: errorColor,
				description: `${type === "client" ? "Client" : "User"} can't execute \`${command.id}\` due to missing permissions.`,
				footer: { text: `Missing: ${missing}` },
			}));
			return setTimeout(async () => {
				if (message.guild?.me?.hasPermission("MANAGE_MESSAGES")) msg?.delete();
			}, 7500);
		}
	}
}

