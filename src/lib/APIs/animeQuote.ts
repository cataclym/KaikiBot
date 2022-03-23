import { Message, MessageEmbed } from "discord.js";
import { respType } from "../Types/TCustom";

export async function sendQuote(resp: respType, message: Message): Promise<Message> {

    return message.channel.send({
        embeds: [new MessageEmbed()
            .setDescription(`"${resp.quote}"`)
            .addFields([
                { name: "Character", value: resp.character, inline: true },
                { name: "Anime", value: resp.anime, inline: true },
            ])
            .withOkColor(message)],
    });
}
