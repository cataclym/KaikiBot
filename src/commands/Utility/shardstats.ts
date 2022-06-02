import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

enum shardStats {
    "READY",
    "CONNECTING",
    "RECONNECTING",
    "IDLE",
    "NEARLY",
    "DISCONNECTED",
}

export default class ShardStatisticsCommand extends KaikiCommand {
    constructor() {
        super("shardstats", {
            aliases: ["shards", "shardstats"],
            description: "Displays the states of all shards",
            channel: "guild",
            subCategory: "Info",
        });
    }

    public async exec(message: Message<true>) {

        const { ws } = message.client;

        return message.channel.send({
            content: `${await Utility.codeblock(`This guild is managed by shard: [${message.guild.shardId}]`, "xl")}
    ${await Utility.codeblock(Array.from(ws.shards.entries())
        .map(([, w]) => `ID: [${w.id}] | Ping: ${w.ping}ms | Status: ${shardStats[w.status]}`)
        .join("\n"), "xl")}`,
        });
    }
}
