import { resetDailyClaims } from "../../lib/functions";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class DailyResetCommand extends KaikiCommand {
    constructor() {
        super("dailyreset", {
            aliases: ["dailyreset", "resetdaily"],
            description: "Resets daily claims that have been made",
            usage: "",
            ownerOnly: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        await resetDailyClaims();
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription("Daily claims have been reset!")
                .withOkColor(message),
            ],
        });
    }
}
