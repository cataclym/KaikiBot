import { Message, EmbedBuilder } from "discord.js";
import { respType } from "../Types/TCustom";

export async function sendQuote(resp: respType, message: Message): Promise<Message> {

    return message.channel.send({
        embeds: [new EmbedBuilder()
            .setDescription(`"${resp.quote}"`)
            .addFields([
                { name: "Character", value: resp.character, inline: true },
                { name: "Anime", value: resp.anime, inline: true },
            ])
            .withOkColor(message)],
    });
}
