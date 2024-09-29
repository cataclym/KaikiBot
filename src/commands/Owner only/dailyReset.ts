import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "dailyreset",
    aliases: ["resetdaily"],
    usage: "",
    description: "Resets daily claims that have been made",
    preconditions: ["OwnerOnly"],
})
export default class DailyResetCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        await this.client.resetDailyClaims();
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Daily claims have been reset!")
                    .withOkColor(message),
            ],
        });
    }
}
