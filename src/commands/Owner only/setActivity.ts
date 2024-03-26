import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

export type ValidActivities =
    | "PLAYING"
    | "STREAMING"
    | "LISTENING"
    | "WATCHING"
    | "COMPETING";

@ApplyOptions<KaikiCommandOptions>({
    name: "setactivity",
    aliases: ["setac"],
    description: "Set the bot's activity.\n",
    usage: ["<type> <Activity>", "Playing with Dreb"],
    preconditions: ["OwnerOnly"],
})
export default class SetActivityCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const type = await args.pick("activityType");

        const name = await args.rest("string");

        return Promise.all([
            message.client.user?.setActivity({
                type: Constants.activityTypes[type],
                name: name,
            }),
            this.client.botSettings.set("1", "Activity", name),
            this.client.botSettings.set("1", "ActivityType", type),
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .addFields({
                            name: "Status changed",
                            value: `**Type**: ${type}\n**Activity**: ${name}`,
                        })
                        .withOkColor(message),
                ],
            }),
        ]);
    }
}
