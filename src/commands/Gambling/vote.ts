import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import process from "process";

@ApplyOptions<KaikiCommandOptions>({
    name: "vote",
    aliases: [],
    description: "Vote for me on DiscordBotList, receive a currency reward!",
})
export default class Cash extends KaikiCommand {
    public async messageRun(msg: Message) {
        if (!process.env.DBL_PAGE_URL) return;

        return msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vote here")
                    .setURL(process.env.DBL_PAGE_URL),
            ],
        });
    }
}
