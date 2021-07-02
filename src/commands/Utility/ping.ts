import { MessageEmbed, Message } from "discord.js";
import { KaikiCommand } from "Kaiki";

export default class PingCommand extends KaikiCommand {
	public constructor() {
		super("ping", {
			description: "Ping the bot and websocket to see if there are latency issues.",
			aliases: ["p", "ping"],
		});
	}

	public async exec(message: Message): Promise<Message> {

		const InitialMSG: Message = await message.channel.send("Pinging...!"),
			WSTime: number = Math.abs(message.client.ws.ping),
			ClientTime: number = InitialMSG.createdTimestamp - message.createdTimestamp;

		return InitialMSG.edit({ embeds: [new MessageEmbed()
			.addFields([
				{ name: "WebSocket ping", value: WSTime + " ms", inline: true },
				{ name: "Client ping", value: ClientTime + " ms", inline: true }])
			.withOkColor(message)],
		});
	}
}
