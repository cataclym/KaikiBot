import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class PingCommand extends KaikiCommand {
    public constructor() {
        super("ping", {
            description: "Ping the bot and websocket to see if there are latency issues.",
            aliases: ["p", "ping"],
            subCategory: "Info",
        });
    }

    public async exec(message: Message): Promise<Message> {

        const initialMsg = await message.channel.send("Pinging...!"),
            wsTime = Math.abs(message.client.ws.ping),
            clientTime = initialMsg.createdTimestamp - message.createdTimestamp;

        return initialMsg.edit({
            embeds: [new MessageEmbed()
                .addFields([
                    { name: "WebSocket ping", value: wsTime + " ms", inline: true },
                    { name: "Client ping", value: clientTime + " ms", inline: true }])
                .withOkColor(message)],
            content: null,
        });
    }
}
