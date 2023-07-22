import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "ping",
    aliases: ["p"],
    description: "Ping the bot and websocket to see if there are latency issues.",
})
export default class PingCommand extends KaikiCommand {
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
