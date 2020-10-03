import { getMemberColorAsync } from "../../functions/Util";
import { MessageEmbed, Message } from "discord.js";
import { Command } from "discord-akairo";

export default class PingCommand extends Command {
	public constructor() {
		super("ping", {
			description: { description: "Ping!" },
			aliases: ["p", "ping"],
		});
	}
	public async exec(message: Message): Promise<Message> {
		const InitialMSG: Message = await message.channel.send("Pinging...!"),
			WSTime: number = Math.abs(message.client.ws.ping),
			ClientTime: number = InitialMSG.createdTimestamp - message.createdTimestamp,
			embed = new MessageEmbed()
				.addFields([
					{ name: "WebSocket ping", value: WSTime + " ms", inline: true },
					{ name: "Client ping", value: ClientTime + " ms", inline: true }])
				.setColor(await getMemberColorAsync(message));
		return InitialMSG.edit(null, embed);
	}
}
