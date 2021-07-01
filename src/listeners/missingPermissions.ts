import { Command, Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import logger from "loglevel";
import { cmdStatsCache } from "../cache/cache";
import { listenerLog } from "../lib/Util";


export default class missingPermissionsListener extends Listener {
	constructor() {
		super("missingPermissions", {
			event: "missingPermissions",
			emitter: "commandHandler",
		});
	}

	// Emitted when a permissions check is failed.

	public async exec(message: Message, command: Command, type: string, missing: any): Promise<NodeJS.Timeout | void> {

		listenerLog(message, this, logger.info, command);

		cmdStatsCache[command.id]
			? cmdStatsCache[command.id]++
			: cmdStatsCache[command.id] = 1;

		if (message.channel.type !== "dm") {
			const msg = await message.channel.send({ embeds:
				[new MessageEmbed({
					title: "Missing permissions",
					description: `${type === "client" ? "Client" : "User"} can't execute \`${command.id}\` due to missing permissions.`,
					footer: { text: `Missing: ${missing}` },
				})
					.withErrorColor(message)],
			});

			return this.client.setTimeout(() => msg.delete()
				.catch(logger.error), 10000);

		}
	}
}

