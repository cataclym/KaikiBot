import { Command } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class PingCommand extends KaikiCommand {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "ping",
            aliases: ["p", "pong"],
            description: "Ping the bot and websocket to see if there are latency issues.",
        });
    }

    public async messageRun(message: Message) {

        const initialMsg = await message.channel.send("Pinging...!"),
            wsTime = Math.abs(message.client.ws.ping),
            clientTime = initialMsg.createdTimestamp - message.createdTimestamp;

        return initialMsg.edit({
            embeds: [
                new EmbedBuilder()
                    .addFields([
                        { name: "WebSocket ping", value: wsTime + " ms", inline: true },
                        { name: "Client ping", value: clientTime + " ms", inline: true },
                    ])
                    .withOkColor(message),
            ],
            content: null,
        });
    }
}
