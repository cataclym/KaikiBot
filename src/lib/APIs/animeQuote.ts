import { EmbedBuilder, Message } from "discord.js";
import { RespType } from "../Types/Miscellaneous";

export async function sendQuote(resp: RespType, message: Message): Promise<Message> {

    return message.channel.send({
        embeds: [
            new EmbedBuilder()
                .setDescription(`"${resp.quote}"`)
                .addFields([
                    { name: "Character", value: resp.character, inline: true },
                    { name: "Anime", value: resp.anime, inline: true },
                ])
                .withOkColor(message),
        ],
    });
}
