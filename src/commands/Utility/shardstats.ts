import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";

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
    usage: "",
    description: "Displays the states of all shards",
    preconditions: ["GuildOnly"],
    minorCategory: "Info",
})
export default class ShardStatisticsCommand extends KaikiCommand {
    public async messageRun(message: Message<true>) {
        const { ws } = message.client;

        return message.channel.send({
            content: `${await KaikiUtil.codeblock(`This guild is managed by shard: [${message.guild.shardId}]`, "xl")}
    ${await KaikiUtil.codeblock(
        Array.from(ws.shards.entries())
            .map(
                ([, w]) =>
                    `ID: [${w.id}] | Ping: ${w.ping}ms | Status: ${ShardStats[w.status]}`
            )
            .join("\n"),
        "xl"
    )}`,
        });
    }
}
