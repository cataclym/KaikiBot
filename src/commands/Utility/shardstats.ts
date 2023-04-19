import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

enum ShardStats {
    "READY",
    "CONNECTING",
    "RECONNECTING",
    "IDLE",
    "NEARLY",
    "DISCONNECTED",
}

@ApplyOptions<KaikiCommandOptions>({
    name: "shardstats",
    aliases: ["shards"],
    description: "Displays the states of all shards",
    preconditions: ["GuildOnly"],
    subCategory: "Info",
})
export default class ShardStatisticsCommand extends KaikiCommand {
    public async messageRun(message: Message<true>) {

        const { ws } = message.client;

        return message.channel.send({
            content: `${await Utility.codeblock(`This guild is managed by shard: [${message.guild.shardId}]`, "xl")}
    ${await Utility.codeblock(Array.from(ws.shards.entries())
        .map(([, w]) => `ID: [${w.id}] | Ping: ${w.ping}ms | Status: ${ShardStats[w.status]}`)
        .join("\n"), "xl")}`,
        });
    }
}
