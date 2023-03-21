import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

export type ValidActivities = "PLAYING"
    | "STREAMING"
    | "LISTENING"
    | "WATCHING"
    | "COMPETING";

@ApplyOptions<KaikiCommandOptions>({
    name: "setavatar",
    aliases: ["setav"],
    description: "Assigns the bot a new avatar.",
    usage: ["https://discord.com/media/someplace/somepicture.png"],
    preconditions: ["OwnerOnly"],
})
export default class SetActivityCommand extends KaikiCommand {
    static validActivities: ValidActivities[] = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"];

    public async messageRun(message: Message, args: Args) {

        const type = await args.pick(KaikiArgumentsTypes.activityTypeArgument);

        const name = await args.rest("string");

        return Promise.all([
            message.client.user?.setActivity({ type: Constants.activityTypes[type], name: name }),
            this.client.botSettings.set("1", "Activity", name),
            this.client.botSettings.set("1", "ActivityType", type),
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .addFields({
                            name: "Status changed", value: `**Type**: ${type}\n**Activity**: ${name}`,
                        })
                        .withOkColor(message),
                ],
            }),
        ]);
    }
}
