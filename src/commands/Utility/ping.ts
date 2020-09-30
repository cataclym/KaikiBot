import { ColorResolvable, MessageEmbed, Message } from "discord.js";
import { Command } from "discord-akairo";

export default class PingCommand extends Command {
	public constructor() {
		super("ping", {
			description: { description: "Ping!" },
			aliases: ["p", "ping"],
		});
	}
	public async exec(message: Message) {
		const InitialMSG: Message = await message.channel.send("Pinging...!"),
			WSTime: Number = Math.abs(message.client.ws.ping),
			ClientTime: Number = InitialMSG.createdTimestamp - message.createdTimestamp;
		const color: ColorResolvable = message!.member!.displayColor,
			embed: MessageEmbed = new MessageEmbed()
				.addFields([
					{ name: "WebSocket ping", value: WSTime + " ms", inline: true },
					{ name: "Client ping", value: ClientTime + " ms", inline: true }])
				.setColor(color);
		return InitialMSG.edit(null, embed);
	}
};
